import type { NutritionEntry } from "../constants/nutrition";

export const REGIONS = {
  POLAND: "PL",
} as const;

export type RegionCode = string;
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

export interface Produce {
  id: string;
  seasonalityByRegion: Partial<Record<RegionCode, RegionalSeasonality>>;
  wikipediaUrl?: string;
  nutritionItems?: NutritionEntry[];
  defaultRecipeIds?: string[];
  rarity: 1 | 2 | 3 | 4 | 5;
}
