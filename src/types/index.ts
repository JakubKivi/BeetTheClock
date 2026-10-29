export const REGIONS = {
  POLAND: "PL",
} as const;

export type RegionCode = (typeof REGIONS)[keyof typeof REGIONS];
export type MonthOfYear = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type NotificationFrequency = "monthly" | "weekly" | "daily";
export type NotificationWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface RegionalSeasonality {
  months: MonthOfYear[];
  bestMonths?: MonthOfYear[];
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
  recipes?: string[];
  rarity: 1 | 2 | 3 | 4 | 5;
}
