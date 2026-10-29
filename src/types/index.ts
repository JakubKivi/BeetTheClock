export const REGIONS = {
  POLAND: "PL",
} as const;

export type RegionCode = (typeof REGIONS)[keyof typeof REGIONS];
export type MonthOfYear = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type NotificationFrequency = "monthly" | "weekly" | "daily";
// Monday = 1 through Sunday = 7.
export type NotificationWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface RegionalSeasonality {
  // Estimated fresh retail availability in the region, including imports and storage.
  months: MonthOfYear[];
  // Local harvest peak, or the exporter-region peak for import-only produce.
  bestMonths?: MonthOfYear[];
}

export interface Recipe {
  id: string;
  name: string;
  plName?: string;
  instructions: string;
  plInstructions?: string;
  note?: string;
}

export interface NutritionNote {
  en: string;
  pl: string;
}

export interface Produce {
  id: string;
  name: string;
  plName: string;
  seasonalityByRegion: Partial<Record<RegionCode, RegionalSeasonality>>;
  emoji?: string;
  selectionGuide?: string;
  plSelectionGuide?: string;
  storageGuide?: string;
  plStorageGuide?: string;
  wikipediaUrl?: string;
  nutritionalInfo?: string;
  plNutritionalInfo?: string;
  nutritionNote?: NutritionNote;
  recipes?: Recipe[];
  rarity: 1 | 2 | 3 | 4 | 5;
}
