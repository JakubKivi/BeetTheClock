import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { PRODUCE_DATA } from "../constants/produce";
import { Language, i18n } from "./i18n";
import { AppSettings } from "./storage";

// Set up how notifications should be handled when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
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

export async function syncScheduledNotifications(
  settings: AppSettings,
  language: Language,
): Promise<boolean> {
  if (Platform.OS === "web") return !settings.notificationsEnabled;

  if (settings.notificationsEnabled) {
    const granted = await requestNotificationPermissions();
    if (!granted) return false;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.notificationsEnabled) return true;

  const frequency = settings.notificationFrequency ?? "monthly";
  const notificationTime = settings.notificationTime ?? "09:00";
  const weekday = settings.notificationWeekday ?? 1;
  const onlyFavorites = settings.notificationsOnlyFavorites ?? false;
  const favoriteProduce = onlyFavorites
    ? PRODUCE_DATA.filter((produce) => settings.favItems.includes(produce.id))
    : [];
  if (onlyFavorites && favoriteProduce.length === 0) return true;

  const body = onlyFavorites
    ? `${i18n.t("notifications.favoritesBody", language)} ${favoriteProduce
        .map((produce) => (language === "pl" ? produce.plName : produce.name))
        .join(", ")}`
    : i18n.t("notifications.body", language);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notifications.title", language),
      body,
    },
    trigger: createNotificationTrigger(frequency, notificationTime, weekday),
  });
  return true;
}