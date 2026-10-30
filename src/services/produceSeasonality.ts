import {
  MonthOfYear,
  Produce,
  RegionCode,
  REGIONS,
  RegionalSeasonality,
} from "../types";

export const DEFAULT_REGION: RegionCode = REGIONS.POLAND;
export const USE_DEVICE_DATE = false;
export const SEASON_REFERENCE_DATE = USE_DEVICE_DATE
  ? new Date()
  : new Date(2026, 8, 1);

export function getSeasonality(
  produce: Produce,
  region: RegionCode,
): RegionalSeasonality | undefined {
  return produce.seasonalityByRegion[region];
}

export function isAvailableInRegion(
  produce: Produce,
  region: RegionCode,
  month: MonthOfYear,
): boolean {
  return getSeasonality(produce, region)?.months.includes(month) ?? false;
}
