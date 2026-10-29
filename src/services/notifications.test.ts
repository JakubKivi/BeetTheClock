import { describe, expect, it, jest } from "@jest/globals";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  SchedulableTriggerInputTypes: {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
  },
}));

import {
  createNotificationTrigger,
  isValidNotificationTime,
} from "./notifications";

describe("notification scheduling", () => {
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
      weekday: 5,
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
});
