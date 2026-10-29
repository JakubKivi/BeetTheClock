import {
  MonthOfYear,
  Produce,
  RegionCode,
  REGIONS,
  RegionalSeasonality,
} from "../types";

export const DEFAULT_REGION: RegionCode = REGIONS.POLAND;

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
