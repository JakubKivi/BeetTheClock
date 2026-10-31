import {
  MonthOfYear,
  Produce,
  RegionCode,
  RegionalSeasonality,
} from "../types";
import { DEFAULT_REGION } from "../constants/regions";

export { DEFAULT_REGION };

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
