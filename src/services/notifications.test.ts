import { describe, expect, it, jest } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  SchedulableTriggerInputTypes: {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    DATE: "date",
  },
  AndroidImportance: { DEFAULT: 5 },
  AndroidAudioUsage: { NOTIFICATION: 5 },
  AndroidAudioContentType: { SONIFICATION: 4 },
  setNotificationChannelAsync: jest.fn(async () => null),
  getPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  scheduleNotificationAsync: jest.fn(async () => "notification-id"),
}));

import * as Notifications from "expo-notifications";
import {
  buildNotificationContent,
  createNotificationTrigger,
  createTestNotificationTrigger,
  getNotificationSequenceNumber,
  getTestNotificationDate,
  getUpcomingNotificationDates,
  isValidNotificationTime,
  sendTestNotification,
  requestNotificationPermissions,
} from "./notifications";
import { DEFAULT_SETTINGS } from "./storage";
import type { MonthOfYear, Produce } from "../types";

const makeProduce = (id: string, months: number[]): Produce => ({
  id,
  rarity: 1,
  seasonalityByRegion: {
    PL: { months: months as MonthOfYear[] },
  },
});

describe("notification scheduling", () => {
  it("requests Android notification permissions without creating a custom channel", async () => {
    const platformOS = jest.replaceProperty(Platform, "OS", "android");
    const channelSetter = jest.mocked(Notifications.setNotificationChannelAsync);
    channelSetter.mockClear();

    try {
      await expect(requestNotificationPermissions("en")).resolves.toBe(true);

      expect(channelSetter).not.toHaveBeenCalled();
    } finally {
      platformOS.restore();
      channelSetter.mockClear();
    }
  });

  it("creates monthly, weekly, and daily triggers at the selected time", () => {
    expect(createNotificationTrigger("monthly", "08:30")).toEqual({
      type: "monthly",
      day: 1,
      hour: 8,
      minute: 30,
    });
    expect(createNotificationTrigger("weekly", "08:30")).toEqual({
      type: "weekly",
      weekday: 2,
      hour: 8,
      minute: 30,
    });
    expect(createNotificationTrigger("weekly", "08:30", 5)).toEqual({
      type: "weekly",
      weekday: 6,
      hour: 8,
      minute: 30,
    });
    expect(createNotificationTrigger("weekly", "08:30", 7)).toEqual({
      type: "weekly",
      weekday: 1,
      hour: 8,
      minute: 30,
    });
    expect(createNotificationTrigger("daily", "08:30")).toEqual({
      type: "daily",
      hour: 8,
      minute: 30,
    });
  });

  it("rejects malformed or out-of-range notification times", () => {
    expect(isValidNotificationTime("00:00")).toBe(true);
    expect(isValidNotificationTime("23:59")).toBe(true);
    expect(isValidNotificationTime("24:00")).toBe(false);
    expect(isValidNotificationTime("9:30")).toBe(false);
    expect(() => createNotificationTrigger("daily", "24:00")).toThrow(
      "Notification time must use HH:MM 24-hour format.",
    );
    expect(() => createNotificationTrigger("weekly", "09:00", 8)).toThrow(
      "Notification weekday must be between 1 and 7.",
    );
  });

  it("plans dated notifications within the upcoming delivery window", () => {
    const now = new Date(2026, 0, 4, 8, 0);
    expect(getUpcomingNotificationDates("daily", "09:00", 1, now, 2)).toEqual([
      new Date(2026, 0, 4, 9, 0),
      new Date(2026, 0, 5, 9, 0),
    ]);
    expect(
      getUpcomingNotificationDates("weekly", "09:00", 1, now, 2),
    ).toEqual([new Date(2026, 0, 5, 9, 0), new Date(2026, 0, 12, 9, 0)]);
    expect(
      getUpcomingNotificationDates(
        "monthly",
        "09:00",
        1,
        new Date(2026, 0, 31, 10, 0),
        2,
      ),
    ).toEqual([new Date(2026, 1, 1, 9, 0), new Date(2026, 2, 1, 9, 0)]);
    expect(() =>
      getUpcomingNotificationDates("daily", "09:00", 1, now, -1),
    ).toThrow("Notification count must be a non-negative integer.");
  });

  it("advances test previews by the configured notification frequency", () => {
    const referenceDate = new Date(2026, 1, 1);
    const monthlySettings = {
      ...DEFAULT_SETTINGS,
      notificationFrequency: "monthly" as const,
    };
    const weeklySettings = {
      ...DEFAULT_SETTINGS,
      notificationFrequency: "weekly" as const,
      notificationWeekday: 1 as const,
    };
    const dailySettings = {
      ...DEFAULT_SETTINGS,
      notificationFrequency: "daily" as const,
    };

    expect(getTestNotificationDate(monthlySettings, 0, referenceDate)).toEqual(
      new Date(2026, 1, 1, 9),
    );
    expect(getTestNotificationDate(monthlySettings, 1, referenceDate)).toEqual(
      new Date(2026, 2, 1, 9),
    );
    expect(getTestNotificationDate(weeklySettings, 1, referenceDate)).toEqual(
      new Date(2026, 1, 9, 9),
    );
    expect(getTestNotificationDate(dailySettings, 1, referenceDate)).toEqual(
      new Date(2026, 1, 2, 9),
    );
  });

  it("includes newly seasonal asparagus in the February monthly preview", () => {
    const asparagus = makeProduce("asparagus", [1, 2, 3, 4, 5, 6, 7]);
    const settings = {
      ...DEFAULT_SETTINGS,
      notificationFrequency: "monthly" as const,
      favItems: ["asparagus"],
      regionCode: "PL",
    };
    const february = new Date(2026, 1, 1, 9);

    const content = buildNotificationContent(
      settings,
      "en",
      february,
      getNotificationSequenceNumber("monthly", february),
      [asparagus],
    );

    expect(content.body).toContain("asparagus");
  });

  it("prioritizes newly seasonal favorites, then fresh picks and occasional endings", () => {
    const produce = [
      makeProduce("favorite-new", [5, 6]),
      makeProduce("favorite-current", [4, 5, 6]),
      makeProduce("new-pick", [5, 6]),
      makeProduce("ending-pick", [4, 5]),
    ];
    const settings = {
      ...DEFAULT_SETTINGS,
      favItems: ["favorite-new", "favorite-current"],
      regionCode: "PL",
    };
    const june = new Date(2026, 5, 10);

    expect(
      buildNotificationContent(settings, "en", june, 0, produce).body,
    ).toContain("favorite-new");
    expect(
      buildNotificationContent(
        { ...settings, favItems: [] },
        "en",
        june,
        0,
        produce,
      ).body,
    ).toContain("new-pick");
    expect(
      buildNotificationContent(
        { ...settings, notificationFrequency: "daily" },
        "en",
        june,
        4,
        produce,
      ).body,
    ).toContain("ending-pick");
  });

  it("keeps favorites-only messages focused on saved produce", () => {
    const produce = [
      makeProduce("favorite", [5, 6]),
      makeProduce("not-favorite", [5, 6]),
    ];
    const content = buildNotificationContent(
      {
        ...DEFAULT_SETTINGS,
        regionCode: "PL",
        favItems: ["favorite"],
        notificationsOnlyFavorites: true,
      },
      "en",
      new Date(2026, 5, 10),
      0,
      produce,
    );

    expect(content.body).toContain("favorite");
    expect(content.body).not.toContain("not-favorite");

    const waitingContent = buildNotificationContent(
      {
        ...DEFAULT_SETTINGS,
        regionCode: "PL",
        favItems: ["favorite"],
        notificationsOnlyFavorites: true,
      },
      "en",
      new Date(2026, 5, 10),
      0,
      [makeProduce("favorite", [0, 1]), makeProduce("new-pick", [5, 6])],
    );
    expect(waitingContent.body).toContain("favorites");
    expect(waitingContent.body).not.toContain("new-pick");
  });

  it("rotates through distinct copy for frequent notifications", () => {
    const produce = [makeProduce("year-round", Array.from({ length: 12 }, (_, i) => i))];
    const messages = Array.from({ length: 8 }, (_, day) =>
      buildNotificationContent(
        { ...DEFAULT_SETTINGS, regionCode: "PL", favItems: [] },
        "en",
        new Date(2026, 5, day + 1),
        day,
        produce,
      ).body,
    );

    expect(new Set(messages).size).toBe(8);
  });

  it("uses a stable sequence across schedule refreshes and advances by cadence", () => {
    const monday = new Date(2026, 5, 1, 9);
    const nextMonday = new Date(2026, 5, 8, 9);
    const nextDay = new Date(2026, 5, 2, 9);
    const nextMonth = new Date(2026, 6, 1, 9);

    expect(getNotificationSequenceNumber("daily", monday)).toBe(
      getNotificationSequenceNumber("daily", monday),
    );
    expect(getNotificationSequenceNumber("daily", nextDay)).toBe(
      getNotificationSequenceNumber("daily", monday) + 1,
    );
    expect(getNotificationSequenceNumber("weekly", nextMonday)).toBe(
      getNotificationSequenceNumber("weekly", monday) + 1,
    );
    expect(getNotificationSequenceNumber("monthly", nextMonth)).toBe(
      getNotificationSequenceNumber("monthly", monday) + 1,
    );
  });

  it("uses concise high-priority monthly content and varied weekly themes", () => {
    const produce = [
      makeProduce("new-favorite", [5, 6]),
      makeProduce("favorite", [4, 5, 6]),
      makeProduce("new-produce", [5, 6]),
      makeProduce("ending-produce", [4, 5]),
    ];
    const settings = {
      ...DEFAULT_SETTINGS,
      regionCode: "PL",
      favItems: ["new-favorite", "favorite"],
    };
    const june = new Date(2026, 5, 10);
    const monthly = buildNotificationContent(
      { ...settings, notificationFrequency: "monthly" },
      "en",
      june,
      0,
      produce,
    ).body ?? "";
    const weeklyMessages = [0, 1, 2, 3].map((cycle) =>
      buildNotificationContent(
        { ...settings, notificationFrequency: "weekly" },
        "en",
        june,
        cycle,
        produce,
      ).body ?? "",
    );

    expect(monthly).toContain("new-favorite");
    expect(monthly).not.toContain("ending-produce");
    expect(new Set(weeklyMessages).size).toBeGreaterThan(1);
    expect(weeklyMessages.some((message) => message.includes("ending-produce"))).toBe(
      true,
    );
  });

  it("schedules a test notification shortly in the future", async () => {
    const scheduleNotification = jest.mocked(
      Notifications.scheduleNotificationAsync,
    );
    const now = Date.now();
    scheduleNotification.mockClear();
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null);
    jest.mocked(AsyncStorage.setItem).mockResolvedValue(undefined);

    await expect(
      sendTestNotification(DEFAULT_SETTINGS, "en"),
    ).resolves.toBe(true);

    expect(scheduleNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({
          type: "date",
          date: expect.any(Date),
        }),
      }),
    );
    const request = scheduleNotification.mock.calls[0]?.[0];
    expect(request?.content).not.toHaveProperty("channelId");
    if (
      request?.trigger &&
      "date" in request.trigger &&
      request.trigger.date instanceof Date
    ) {
      expect(request.trigger.date.getTime()).toBeGreaterThan(now);
    } else {
      throw new Error("Expected test notification to use a future date trigger.");
    }
  });

  it("rejects test notifications outside development", async () => {
    const developmentFlag = Object.getOwnPropertyDescriptor(
      globalThis,
      "__DEV__",
    );
    Object.defineProperty(globalThis, "__DEV__", { value: false });
    const scheduleNotification = jest.mocked(
      Notifications.scheduleNotificationAsync,
    );
    scheduleNotification.mockClear();

    try {
      await expect(
        sendTestNotification(DEFAULT_SETTINGS, "en"),
      ).rejects.toThrow("Test notifications are only available in development.");
      expect(scheduleNotification).not.toHaveBeenCalled();
    } finally {
      if (developmentFlag) {
        Object.defineProperty(globalThis, "__DEV__", developmentFlag);
      }
    }
  });

  it("uses the system fallback channel for Android test notifications", async () => {
    const platformOS = jest.replaceProperty(Platform, "OS", "android");
    const scheduleNotification = jest.mocked(
      Notifications.scheduleNotificationAsync,
    );
    scheduleNotification.mockClear();

    try {
      await expect(
        sendTestNotification(DEFAULT_SETTINGS, "en"),
      ).resolves.toBe(true);

      const request = scheduleNotification.mock.calls[0]?.[0];
      expect(scheduleNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.objectContaining({
            type: "date",
          }),
        }),
      );
      expect(request?.trigger).not.toHaveProperty("channelId");
    } finally {
      platformOS.restore();
      scheduleNotification.mockClear();
    }
  });

  it("advances the monthly test preview so repeated tests show different content", async () => {
    const scheduleNotification = jest.mocked(
      Notifications.scheduleNotificationAsync,
    );
    const storedValues = new Map<string, string>();
    jest.mocked(AsyncStorage.getItem).mockImplementation(async (key) => {
      return storedValues.get(key) ?? null;
    });
    jest.mocked(AsyncStorage.setItem).mockImplementation(
      async (key, value) => {
        storedValues.set(key, value);
      },
    );
    scheduleNotification.mockClear();

    const settings = {
      ...DEFAULT_SETTINGS,
      notificationFrequency: "monthly" as const,
      favItems: ["2"],
      regionCode: "PL",
    };
    await sendTestNotification(settings, "en");
    await sendTestNotification(settings, "en");

    const firstBody = scheduleNotification.mock.calls[0]?.[0].content.body;
    const secondBody = scheduleNotification.mock.calls[1]?.[0].content.body;
    expect(firstBody).toEqual(expect.any(String));
    expect(secondBody).toEqual(expect.any(String));
    expect(secondBody).not.toBe(firstBody);
  });

  it("selects immediate delivery for Expo Go", () => {
    const platformOS = jest.replaceProperty(Platform, "OS", "android");
    try {
      const now = new Date();
      expect(createTestNotificationTrigger(now, "expo")).toBeNull();
      const standaloneTrigger = createTestNotificationTrigger(now, null);
      expect(standaloneTrigger).toEqual(
        expect.objectContaining({ type: "date", date: expect.any(Date) }),
      );
      if (
        standaloneTrigger &&
        "date" in standaloneTrigger &&
        standaloneTrigger.date instanceof Date
      ) {
        expect(standaloneTrigger.date.getTime()).toBeGreaterThan(now.getTime());
      } else {
        throw new Error("Expected standalone delivery to use a future date.");
      }
    } finally {
      platformOS.restore();
    }
  });
});
