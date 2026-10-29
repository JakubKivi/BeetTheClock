import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "./i18n";
import {
  NotificationFrequency,
  NotificationWeekday,
  RegionCode,
  REGIONS,
} from "../types";

const SETTINGS_KEY = "BeetTheClock:settings";

export type AppSettings = {
  phoneNumber: string;
  notificationsEnabled: boolean;
  notificationsOnlyFavorites?: boolean;
  notificationFrequency?: NotificationFrequency;
  notificationWeekday?: NotificationWeekday;
  notificationTime?: string;
  favItems: string[];
  language?: Language;
  regionCode?: RegionCode;
};

export const DEFAULT_SETTINGS: AppSettings = {
  phoneNumber: "",
  notificationsEnabled: false,
  notificationsOnlyFavorites: false,
  notificationFrequency: "monthly",
  notificationWeekday: 2,
  notificationTime: "09:00",
  favItems: [],
  language: "en",
  regionCode: REGIONS.POLAND,
};

export const getSettings = async (): Promise<AppSettings | null> => {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!json) return null;
    return JSON.parse(json) as AppSettings;
  } catch (e) {
    console.warn("getSettings error", e);
    throw e;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn("saveSettings error", e);
    throw e;
  }
};
