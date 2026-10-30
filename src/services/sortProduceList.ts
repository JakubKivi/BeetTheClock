import { MonthOfYear, Produce, RegionCode } from "../types";
import {
  getSeasonality,
  SEASON_REFERENCE_DATE,
} from "./produceSeasonality";

export interface SortedProduceItem {
  item: Produce;
  statusBadge: "new" | "end" | null;
}

type SeasonStatus = "new" | "end" | "normal";

function getSeasonGroups(months: MonthOfYear[]): MonthOfYear[][] {
  const sorted = [...new Set(months)].sort((a, b) => a - b);
  const groups: MonthOfYear[][] = [];

  for (const month of sorted) {
    const currentGroup = groups[groups.length - 1];
    if (currentGroup && month === currentGroup[currentGroup.length - 1] + 1) {
      currentGroup.push(month);
    } else {
      groups.push([month]);
    }
  }

  if (groups.length > 1 && sorted[0] === 0 && sorted[sorted.length - 1] === 11) {
    const firstGroup = groups.shift()!;
    const lastGroup = groups.pop()!;
    groups.unshift([...lastGroup, ...firstGroup]);
  }

  return groups;
}

function getDaysUntilNextSeasonEnd(
  seasonGroups: MonthOfYear[][],
  currentMonth: MonthOfYear,
  today: Date,
): number {
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const daysUntilEnds = seasonGroups.map((group) => {
    const endMonth = group[group.length - 1];
    const endYear =
      endMonth < currentMonth ? today.getFullYear() + 1 : today.getFullYear();
    const seasonEnd = new Date(endYear, endMonth + 1, 0);
    const seasonEndUtc = Date.UTC(
      seasonEnd.getFullYear(),
      seasonEnd.getMonth(),
      seasonEnd.getDate(),
    );
    return Math.max(
      0,
      Math.round((seasonEndUtc - todayUtc) / (24 * 60 * 60 * 1000)),
    );
  });

  return Math.min(...daysUntilEnds);
}

function getSeasonStatus(
  months: MonthOfYear[],
  currentMonth: MonthOfYear,
  today: Date,
): { status: SeasonStatus; daysLeft: number } {
  const seasonGroups = getSeasonGroups(months);
  if (seasonGroups.length === 1 && seasonGroups[0].length === 12) {
    return { status: "normal", daysLeft: Number.MAX_SAFE_INTEGER };
  }

  const currentSeason = seasonGroups.find((group) =>
    group.includes(currentMonth),
  );
  if (currentSeason?.[0] === currentMonth) {
    return { status: "new", daysLeft: 0 };
  }
  if (currentSeason?.[currentSeason.length - 1] === currentMonth) {
    return { status: "end", daysLeft: 0 };
  }

  return {
    status: "normal",
    daysLeft: getDaysUntilNextSeasonEnd(seasonGroups, currentMonth, today),
  };
}

export function sortProduceList(
  produce: Produce[],
  currentMonth: MonthOfYear,
  region: RegionCode,
): SortedProduceItem[] {
  const today = SEASON_REFERENCE_DATE;
  const statusOrder: Record<SeasonStatus, number> = {
    new: 0,
    end: 1,
    normal: 2,
  };

  const processedItems = produce.flatMap((item) => {
    const seasonality = getSeasonality(item, region);
    if (!seasonality?.months.length) return [];

    const seasonStatus = getSeasonStatus(
      seasonality.months,
      currentMonth,
      today,
    );
    const statusBadge =
      seasonStatus.status === "normal" ? null : seasonStatus.status;

    return {
      item,
      isAvailable: seasonality.months.includes(currentMonth),
      statusBadge,
      daysLeft: seasonStatus.daysLeft,
      seasonStatus: seasonStatus.status,
    };
  });

  return processedItems
    .sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1;
      }

      const statusDiff =
        statusOrder[a.seasonStatus] - statusOrder[b.seasonStatus];
      return statusDiff || a.daysLeft - b.daysLeft;
    })
    .map(({ item, statusBadge }) => ({ item, statusBadge }));
}
