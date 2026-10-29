import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "./i18n";
import {
  NotificationFrequency,
  NotificationWeekday,
  RegionCode,
  REGIONS,
  Recipe,
} from "../types";

const SETTINGS_KEY = "BeetTheClock:settings";
const SETTINGS_VERSION = 2;

export type AppSettings = {
  phoneNumber: string;
  notificationsEnabled: boolean;
  notificationsOnlyFavorites?: boolean;
  notificationFrequency?: NotificationFrequency;
  notificationWeekday?: NotificationWeekday;
  notificationTime?: string;
  favItems: string[];
  customRecipes?: Record<string, Recipe[]>;
  produceNotes?: Record<string, string>;
  language?: Language;
  regionCode?: RegionCode;
  settingsVersion?: number;
};

export const DEFAULT_SETTINGS: AppSettings = {
  phoneNumber: "",
  notificationsEnabled: false,
  notificationsOnlyFavorites: false,
  notificationFrequency: "monthly",
  notificationWeekday: 1,
  notificationTime: "09:00",
  favItems: [],
  language: "en",
  regionCode: REGIONS.POLAND,
  settingsVersion: SETTINGS_VERSION,
};

export const migrateSettings = (settings: AppSettings): AppSettings => {
  if (settings.settingsVersion === SETTINGS_VERSION) return settings;

  const legacyWeekday = settings.notificationWeekday;
  return {
    ...settings,
    ...(legacyWeekday !== undefined && {
      notificationWeekday: (((legacyWeekday + 5) % 7) + 1) as NotificationWeekday,
    }),
    settingsVersion: SETTINGS_VERSION,
  };
};

export const getSettings = async (): Promise<AppSettings | null> => {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!json) return null;
    const storedSettings = JSON.parse(json) as AppSettings;
    const settings = migrateSettings(storedSettings);
    if (settings !== storedSettings) {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
    return settings;
  } catch (e) {
    console.warn("getSettings error", e);
    throw e;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ ...settings, settingsVersion: SETTINGS_VERSION }),
    );
  } catch (e) {
    console.warn("saveSettings error", e);
    throw e;
  }
};

export const getCustomRecipes = async (produceId: string): Promise<Recipe[]> =>
  (await getSettings())?.customRecipes?.[produceId] ?? [];

export const addCustomRecipe = async (
  produceId: string,
  recipe: Recipe,
): Promise<Recipe[]> => {
  const settings = (await getSettings()) ?? DEFAULT_SETTINGS;
  const recipes = [...(settings.customRecipes?.[produceId] ?? []), recipe];
  await saveSettings({
    ...settings,
    customRecipes: {
      ...settings.customRecipes,
      [produceId]: recipes,
    },
  });
  return recipes;
};

export const updateCustomRecipe = async (
  produceId: string,
  recipe: Recipe,
): Promise<Recipe[]> => {
  const settings = (await getSettings()) ?? DEFAULT_SETTINGS;
  const existingRecipes = settings.customRecipes?.[produceId] ?? [];
  if (!existingRecipes.some((existing) => existing.id === recipe.id)) {
    throw new Error(`Custom recipe ${recipe.id} was not found for ${produceId}.`);
  }

  const recipes = existingRecipes.map((existing) =>
    existing.id === recipe.id ? recipe : existing,
  );
  await saveSettings({
    ...settings,
    customRecipes: {
      ...settings.customRecipes,
      [produceId]: recipes,
    },
  });
  return recipes;
};

export const deleteCustomRecipe = async (
  produceId: string,
  recipeId: string,
): Promise<Recipe[]> => {
  const settings = (await getSettings()) ?? DEFAULT_SETTINGS;
  const existingRecipes = settings.customRecipes?.[produceId] ?? [];
  if (!existingRecipes.some((recipe) => recipe.id === recipeId)) {
    throw new Error(`Custom recipe ${recipeId} was not found for ${produceId}.`);
  }

  const recipes = existingRecipes.filter((recipe) => recipe.id !== recipeId);
  const customRecipes = { ...settings.customRecipes };
  if (recipes.length) {
    customRecipes[produceId] = recipes;
  } else {
    delete customRecipes[produceId];
  }
  await saveSettings({ ...settings, customRecipes });
  return recipes;
};

export const getProduceNote = async (
  produceId: string,
): Promise<string | null> =>
  (await getSettings())?.produceNotes?.[produceId] ?? null;

export const saveProduceNote = async (
  produceId: string,
  note: string | null,
): Promise<void> => {
  const settings = (await getSettings()) ?? DEFAULT_SETTINGS;
  const produceNotes = { ...settings.produceNotes };
  if (note?.trim()) {
    produceNotes[produceId] = note.trim();
  } else {
    delete produceNotes[produceId];
  }
  await saveSettings({ ...settings, produceNotes });
};
