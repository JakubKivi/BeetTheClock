import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "BeetTheClock:settings";

export type AppSettings = {
  phoneNumber: string;
  notificationsEnabled: boolean;
  notificationTime?: string; // "HH:MM"
  favItems: string[];
};

export const getSettings = async (): Promise<AppSettings | null> => {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!json) return null;
    return JSON.parse(json) as AppSettings;
  } catch (e) {
    console.warn("getSettings error", e);
    return null;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn("saveSettings error", e);
  }
};
