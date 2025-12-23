import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSettings } from "../types";

const SETTINGS_KEY = "@user_settings";

export const saveSettings = async (settings: UserSettings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const getSettings = async (): Promise<UserSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};
