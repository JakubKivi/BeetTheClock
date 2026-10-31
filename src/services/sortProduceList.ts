import { MonthOfYear, Produce, RegionCode } from "../types";
import { getSeasonality } from "./produceSeasonality";

export interface SortedProduceItem {
  item: Produce;
  statusBadge: "new" | "end" | "best" | null;
}

type SeasonStatus = "new" | "end" | "normal";
type StatusBadge = SortedProduceItem["statusBadge"];

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

function getSeasonStatus(
  months: MonthOfYear[],
  currentMonth: MonthOfYear,
): SeasonStatus {
  const seasonGroups = getSeasonGroups(months);
  if (seasonGroups.length === 1 && seasonGroups[0].length === 12) {
    return "normal";
  }

  const currentSeason = seasonGroups.find((group) =>
    group.includes(currentMonth),
  );
  if (currentSeason?.[0] === currentMonth) {
    return "new";
  }
  if (currentSeason?.[currentSeason.length - 1] === currentMonth) {
    return "end";
  }

  return "normal";
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function sortProduceList(
  produce: Produce[],
  currentMonth: MonthOfYear,
  region: RegionCode,
): SortedProduceItem[] {
  const processedItems = produce.flatMap((item) => {
    const seasonality = getSeasonality(item, region);
    if (!seasonality?.months.length) return [];

    const seasonStatus = getSeasonStatus(seasonality.months, currentMonth);
    const isYearRound = new Set(seasonality.months).size === 12;
    const isFirstBestMonth =
      isYearRound &&
      seasonality.bestMonths?.includes(currentMonth) === true &&
      !seasonality.bestMonths.includes(
        ((currentMonth + 11) % 12) as MonthOfYear,
      );
    const statusBadge: StatusBadge =
      seasonStatus === "normal"
        ? isFirstBestMonth
          ? "best"
          : null
        : seasonStatus;

    return {
      item,
      isAvailable: seasonality.months.includes(currentMonth),
      statusBadge,
      seasonStatus,
    };
  });

  const availableItems = processedItems.filter((item) => item.isAvailable);
  const unavailableItems = processedItems.filter((item) => !item.isAvailable);
  const sortedItems: typeof processedItems = [];

  for (const items of [availableItems, unavailableItems]) {
    for (const status of ["new", "end", "best", "normal"] as const) {
      sortedItems.push(
        ...shuffle(
          items.filter((item) =>
            status === "best"
              ? item.statusBadge === "best"
              : status === "normal"
                ? item.seasonStatus === "normal" &&
                  item.statusBadge !== "best"
                : item.seasonStatus === status,
          ),
        ),
      );
    }
  }

  return sortedItems.map(({ item, statusBadge }) => ({ item, statusBadge }));
}
