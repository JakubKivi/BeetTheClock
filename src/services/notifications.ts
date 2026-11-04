import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type { MonthOfYear, Produce } from "../types";
import {
  DEFAULT_REGION,
  isAvailableInRegion,
  SEASON_REFERENCE_DATE,
} from "./produceSeasonality";
import { Language, i18n } from "./i18n";
import { AppSettings } from "./storage";
import { getLoadedData } from "./deviceData";

// iOS allows at most 64 pending local notifications.
const NOTIFICATION_HORIZON = {
  daily: 60,
  weekly: 16,
  monthly: 12,
} as const;

const MESSAGE_VARIANTS = {
  "notifications.favoritesNew": 8,
  "notifications.favoritesSeason": 8,
  "notifications.favoritesEnding": 6,
  "notifications.favoritesWaiting": 6,
  "notifications.newProduce": 8,
  "notifications.seasonal": 8,
  "notifications.ending": 8,
} as const;

type MessageCategory = keyof typeof MESSAGE_VARIANTS;
const TEST_NOTIFICATION_INDEX_KEY = "BeetTheClock:notificationTestIndex";
let testNotificationQueue = Promise.resolve();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(
  _language: Language = i18n.getLanguage(),
): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export function isValidNotificationTime(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function createNotificationTrigger(
  frequency: NonNullable<AppSettings["notificationFrequency"]>,
  notificationTime: string,
  weekday = 1,
): Notifications.SchedulableNotificationTriggerInput {
  if (!isValidNotificationTime(notificationTime)) {
    throw new Error("Notification time must use HH:MM 24-hour format.");
  }

  const [hour, minute] = notificationTime.split(":").map(Number);
  if (frequency === "daily") {
    return {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    };
  }
  if (frequency === "weekly") {
    if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) {
      throw new Error("Notification weekday must be between 1 and 7.");
    }
    return {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: (weekday % 7) + 1,
      hour,
      minute,
    };
  }
  return {
    type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
    day: 1,
    hour,
    minute,
  };
}

export function getUpcomingNotificationDates(
  frequency: NonNullable<AppSettings["notificationFrequency"]>,
  notificationTime: string,
  weekday = 1,
  now = new Date(),
  count: number = NOTIFICATION_HORIZON[frequency],
): Date[] {
  if (!isValidNotificationTime(notificationTime)) {
    throw new Error("Notification time must use HH:MM 24-hour format.");
  }
  if (
    frequency === "weekly" &&
    (!Number.isInteger(weekday) || weekday < 1 || weekday > 7)
  ) {
    throw new Error("Notification weekday must be between 1 and 7.");
  }
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("Notification count must be a non-negative integer.");
  }

  const [hour, minute] = notificationTime.split(":").map(Number);
  const firstDate = new Date(now);
  firstDate.setHours(hour, minute, 0, 0);

  if (frequency === "daily") {
    if (firstDate <= now) firstDate.setDate(firstDate.getDate() + 1);
  } else if (frequency === "weekly") {
    const targetDay = weekday % 7;
    const daysUntilTarget = (targetDay - firstDate.getDay() + 7) % 7;
    firstDate.setDate(firstDate.getDate() + daysUntilTarget);
    if (firstDate <= now) firstDate.setDate(firstDate.getDate() + 7);
  } else {
    firstDate.setDate(1);
    if (firstDate <= now) {
      firstDate.setMonth(firstDate.getMonth() + 1);
    }
  }

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(firstDate);
    if (frequency === "daily") {
      date.setDate(date.getDate() + index);
    } else if (frequency === "weekly") {
      date.setDate(date.getDate() + index * 7);
    } else {
      date.setMonth(date.getMonth() + index);
    }
    return date;
  });
}

export function getNotificationSequenceNumber(
  frequency: NonNullable<AppSettings["notificationFrequency"]>,
  date: Date,
): number {
  if (frequency === "monthly") {
    return date.getFullYear() * 12 + date.getMonth();
  }

  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  return frequency === "weekly" ? Math.floor(dayNumber / 7) : dayNumber;
}

const localizedName = (produce: Produce, language: Language, region: string) =>
  i18n.tOptional(`produce.${produce.id}.name`, language, region) ?? produce.id;

const formatItems = (
  items: Produce[],
  language: Language,
  region: string,
  offset: number,
): { items: string; more: string } => {
  const orderedItems = [...items].sort((first, second) =>
    localizedName(first, language, region).localeCompare(
      localizedName(second, language, region),
      language,
    ),
  );
  if (orderedItems.length > 1) {
    const shift = offset % orderedItems.length;
    orderedItems.push(...orderedItems.splice(0, shift));
  }

  const visibleItems = orderedItems.slice(0, 3);
  const hiddenCount = orderedItems.length - visibleItems.length;
  const more = hiddenCount
    ? ` ${i18n
        .t("notifications.moreItems", language, region)
        .replace("{count}", String(hiddenCount))}`
    : "";
  return {
    items: visibleItems
      .map((produce) => localizedName(produce, language, region))
      .join(", "),
    more,
  };
};

const renderMessage = (
  category: MessageCategory,
  items: Produce[],
  language: Language,
  region: string,
  index: number,
): string => {
  const variant = index % MESSAGE_VARIANTS[category];
  const values = formatItems(items, language, region, index);
  return i18n
    .t(`${category}.${variant + 1}`, language, region)
    .replace(/\{(items|more)\}/g, (_, key: "items" | "more") => values[key]);
};

export function buildNotificationContent(
  settings: AppSettings,
  language: Language,
  date: Date,
  notificationIndex: number,
  produceData: Produce[] = getLoadedData()?.produce ?? [],
): Notifications.NotificationContentInput {
  const region = settings.regionCode ?? DEFAULT_REGION;
  const month = date.getMonth() as MonthOfYear;
  const previousMonth = ((month + 11) % 12) as MonthOfYear;
  const nextMonth = ((month + 1) % 12) as MonthOfYear;
  const favorites = produceData.filter((produce) =>
    (settings.favItems ?? []).includes(produce.id),
  );
  const inSeason = produceData.filter((produce) =>
    isAvailableInRegion(produce, region, month),
  );
  const ending = inSeason.filter(
    (produce) => !isAvailableInRegion(produce, region, nextMonth),
  );
  const newProduce = inSeason.filter(
    (produce) => !isAvailableInRegion(produce, region, previousMonth),
  );
  const favoritesInSeason = favorites.filter((produce) =>
    isAvailableInRegion(produce, region, month),
  );
  const favoritesNew = favoritesInSeason.filter(
    (produce) => !isAvailableInRegion(produce, region, previousMonth),
  );
  const favoritesEnding = favoritesInSeason.filter(
    (produce) => !isAvailableInRegion(produce, region, nextMonth),
  );
  const frequency = settings.notificationFrequency ?? "monthly";
  const cycle = notificationIndex;
  const onlyFavorites = settings.notificationsOnlyFavorites ?? false;

  let category: MessageCategory;
  let items: Produce[];
  if (onlyFavorites) {
    if (frequency === "monthly") {
      if (favoritesNew.length > 0) {
        category = "notifications.favoritesNew";
        items = favoritesNew;
      } else if (favoritesEnding.length > 0) {
        category = "notifications.favoritesEnding";
        items = favoritesEnding;
      } else if (favoritesInSeason.length > 0) {
        category = "notifications.favoritesSeason";
        items = favoritesInSeason;
      } else {
        category = "notifications.favoritesWaiting";
        items = favorites;
      }
    } else if (
      frequency === "weekly" &&
      cycle % 4 === 3 &&
      favoritesEnding.length > 0
    ) {
      category = "notifications.favoritesEnding";
      items = favoritesEnding;
    } else if (
      frequency !== "daily" &&
      favoritesNew.length > 0
    ) {
      category = "notifications.favoritesNew";
      items = favoritesNew;
    } else if (
      frequency === "daily" &&
      cycle % 7 === 0 &&
      favoritesNew.length > 0
    ) {
      category = "notifications.favoritesNew";
      items = favoritesNew;
    } else if (
      frequency === "daily" &&
      cycle % 5 === 4 &&
      favoritesEnding.length > 0
    ) {
      category = "notifications.favoritesEnding";
      items = favoritesEnding;
    } else if (favoritesInSeason.length > 0) {
      category = "notifications.favoritesSeason";
      items = favoritesInSeason;
    } else {
      category = "notifications.favoritesWaiting";
      items = favorites;
    }
  } else if (frequency === "monthly") {
    if (favoritesNew.length > 0) {
      category = "notifications.favoritesNew";
      items = favoritesNew;
    } else if (newProduce.length > 0) {
      category = "notifications.newProduce";
      items = newProduce;
    } else if (ending.length > 0) {
      category = "notifications.ending";
      items = ending;
    } else if (favoritesInSeason.length > 0) {
      category = "notifications.favoritesSeason";
      items = favoritesInSeason;
    } else {
      category = "notifications.seasonal";
      items = inSeason.length > 0 ? inSeason : produceData;
    }
  } else if (frequency === "weekly") {
    const weeklyFocus = cycle % 4;
    if (weeklyFocus === 0 && favoritesNew.length > 0) {
      category = "notifications.favoritesNew";
      items = favoritesNew;
    } else if (weeklyFocus === 1 && newProduce.length > 0) {
      category = "notifications.newProduce";
      items = newProduce;
    } else if (weeklyFocus === 2 && favoritesInSeason.length > 0) {
      category = "notifications.favoritesSeason";
      items = favoritesInSeason;
    } else if (weeklyFocus === 3 && ending.length > 0) {
      category = "notifications.ending";
      items = ending;
    } else if (newProduce.length > 0) {
      category = "notifications.newProduce";
      items = newProduce;
    } else if (favoritesInSeason.length > 0) {
      category = "notifications.favoritesSeason";
      items = favoritesInSeason;
    } else if (ending.length > 0) {
      category = "notifications.ending";
      items = ending;
    } else {
      category = "notifications.seasonal";
      items = inSeason.length > 0 ? inSeason : produceData;
    }
  } else if (cycle % 7 === 0 && favoritesNew.length > 0) {
    category = "notifications.favoritesNew";
    items = favoritesNew;
  } else if (cycle % 5 === 4 && ending.length > 0) {
    category = "notifications.ending";
    items = ending;
  } else if (cycle % 4 === 1 && favoritesInSeason.length > 0) {
    category = "notifications.favoritesSeason";
    items = favoritesInSeason;
  } else if (cycle % 2 === 0 && newProduce.length > 0) {
    category = "notifications.newProduce";
    items = newProduce;
  } else {
    category = "notifications.seasonal";
    items = inSeason.length > 0 ? inSeason : produceData;
  }

  const titleIndex = cycle % 6;
  return {
    title: i18n.t(`notifications.title.${titleIndex + 1}`, language, region),
    body: renderMessage(
      category,
      items,
      language,
      region,
      notificationIndex,
    ),
  };
}

const createDateTrigger = (
  date: Date,
): Notifications.SchedulableNotificationTriggerInput => ({
  type: Notifications.SchedulableTriggerInputTypes.DATE,
  date,
});

export const createTestNotificationTrigger = (
  now: Date,
  appOwnership?: string | null,
): Notifications.NotificationTriggerInput =>
  appOwnership === "expo" ||
  (appOwnership === undefined && Constants?.appOwnership === "expo")
    ? null
    : createDateTrigger(new Date(now.getTime() + 1_000));

export function getTestNotificationDate(
  settings: AppSettings,
  testIndex: number,
  referenceDate = SEASON_REFERENCE_DATE,
): Date {
  if (!Number.isInteger(testIndex) || testIndex < 0) {
    throw new Error("Test notification index must be a non-negative integer.");
  }

  const frequency = settings.notificationFrequency ?? "monthly";
  const firstDate = getUpcomingNotificationDates(
    frequency,
    settings.notificationTime ?? "09:00",
    settings.notificationWeekday ?? 1,
    referenceDate,
    1,
  )[0];
  if (!firstDate) {
    throw new Error("Could not determine the next test notification date.");
  }

  const date = new Date(firstDate);
  if (frequency === "daily") {
    date.setDate(date.getDate() + testIndex);
  } else if (frequency === "weekly") {
    date.setDate(date.getDate() + testIndex * 7);
  } else {
    date.setMonth(date.getMonth() + testIndex);
  }
  return date;
}

export async function syncScheduledNotifications(
  settings: AppSettings,
  language: Language,
  now = new Date(),
): Promise<boolean> {
  if (Platform.OS === "web") return !settings.notificationsEnabled;

  if (settings.notificationsEnabled) {
    const granted = await requestNotificationPermissions(language);
    if (!granted) return false;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.notificationsEnabled) return true;

  const frequency = settings.notificationFrequency ?? "monthly";
  const produceData = getLoadedData()?.produce ?? [];
  if (
    (settings.notificationsOnlyFavorites ?? false) &&
    !produceData.some((produce) => settings.favItems.includes(produce.id))
  ) {
    return true;
  }

  const dates = getUpcomingNotificationDates(
    frequency,
    settings.notificationTime ?? "09:00",
    settings.notificationWeekday ?? 1,
    now,
  );
  for (const [index, date] of dates.entries()) {
    await Notifications.scheduleNotificationAsync({
      content: buildNotificationContent(
        settings,
        language,
        date,
        getNotificationSequenceNumber(frequency, date),
        produceData,
      ),
      trigger: createDateTrigger(date),
    });
  }
  return true;
}

export async function sendTestNotification(
  settings: AppSettings,
  language: Language,
): Promise<boolean> {
  if (!__DEV__) {
    throw new Error("Test notifications are only available in development.");
  }

  const operation = testNotificationQueue.then(async () => {
    const granted = await requestNotificationPermissions(language);
    if (!granted) return false;

    const frequency = settings.notificationFrequency ?? "monthly";
    const storedIndex = await AsyncStorage.getItem(
      `${TEST_NOTIFICATION_INDEX_KEY}:${frequency}`,
    );
    const testIndex =
      storedIndex === null || storedIndex === undefined ? 0 : Number(storedIndex);
    if (!Number.isSafeInteger(testIndex) || testIndex < 0) {
      throw new Error("Stored test notification index is invalid.");
    }

    const previewDate = getTestNotificationDate(settings, testIndex);
    await AsyncStorage.setItem(
      `${TEST_NOTIFICATION_INDEX_KEY}:${frequency}`,
      String(testIndex + 1),
    );

    await Notifications.scheduleNotificationAsync({
      content: buildNotificationContent(
        settings,
        language,
        previewDate,
        getNotificationSequenceNumber(frequency, previewDate),
      ),
      trigger: createTestNotificationTrigger(new Date()),
    });
    return true;
  });
  testNotificationQueue = operation.then(
    () => undefined,
    () => undefined,
  );
  return operation;
}
