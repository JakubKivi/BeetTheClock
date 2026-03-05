import { Produce } from "../types";

export interface SortedProduceItem {
  item: Produce;
  statusBadge: "new" | "end" | null;
}

export function sortProduceList(
  produce: Produce[],
  favorites: string[],
  currentMonth: number,
): SortedProduceItem[] {
  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    currentMonth + 1,
    0,
  ).getDate();
  const dayOfMonth = now.getDate();

  const calculateDaysUntilSeasonEnd = (months: number[]): number => {
    // Find the last month in the season
    const sorted = Array.from(new Set(months)).sort((a, b) => a - b);
    const lastMonthInSeason = sorted[sorted.length - 1];

    // If the season ends this month
    if (lastMonthInSeason === currentMonth) {
      return daysInMonth - dayOfMonth;
    }

    // If the season already ended (we're still seeing it via months array)
    if (lastMonthInSeason < currentMonth) {
      // Calculate days until next year's season end
      const daysLeftThisYear = 365 - (now.getFullYear() * 365 + dayOfMonth);
      return daysLeftThisYear;
    }

    // Season ends in a future month
    const monthsDiff = lastMonthInSeason - currentMonth;
    const daysLeftThisMonth = daysInMonth - dayOfMonth;
    // Add days from remaining months
    let totalDays = daysLeftThisMonth;
    for (let i = 1; i < monthsDiff; i++) {
      const monthToAdd = (currentMonth + i) % 12;
      totalDays += new Date(now.getFullYear(), monthToAdd + 1, 0).getDate();
    }
    return totalDays;
  };

  const getContinuousGroups = (sorted: number[]): number[][] => {
    const groups: number[][] = [];
    let currentGroup: number[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (
        currentGroup.length === 0 ||
        sorted[i] === currentGroup[currentGroup.length - 1] + 1
      ) {
        currentGroup.push(sorted[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [sorted[i]];
      }
    }
    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  };

  const getSeasonStatus = (
    months: number[],
  ): { status: "new" | "end" | "normal"; daysLeft: number } => {
    const sorted = Array.from(new Set(months)).sort((a, b) => a - b);
    const isYearRound = sorted.length === 12;

    // Year-round items go to the end
    if (isYearRound) {
      return { status: "normal", daysLeft: 999999 };
    }

    const groups = getContinuousGroups(sorted);
    let isNew = false;
    let isLast = false;
    for (const group of groups) {
      if (group.includes(currentMonth)) {
        if (group[0] === currentMonth) {
          isNew = true;
        }
        if (group[group.length - 1] === currentMonth) {
          isLast = true;
        }
      }
    }

    if (isNew) {
      return { status: "new", daysLeft: 0 };
    }
    if (isLast) {
      return { status: "end", daysLeft: 0 };
    }

    // Calculate days until season ends
    const daysLeft = calculateDaysUntilSeasonEnd(months);
    return { status: "normal", daysLeft };
  };

  // Process items with status
  const processedItems = produce.map((item) => {
    const seasonStatus = getSeasonStatus(item.months);
    let statusBadge: "new" | "end" | null = null;
    if (seasonStatus.status === "new") {
      statusBadge = "new";
    } else if (seasonStatus.status === "end") {
      statusBadge = "end";
    }

    return {
      item,
      isFavorite: favorites.includes(item.id),
      statusBadge,
      daysLeft: seasonStatus.daysLeft,
      seasonStatus: seasonStatus.status,
    };
  });

  // Sort by:
  // 1. Favorites first
  // 2. Season status (new -> end -> others)
  // 3. Days until season ends
  const sorted = processedItems.sort((a, b) => {
    // Favorites first
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    // Within same favorite status, sort by season status
    const statusOrder: Record<string, number> = {
      new: 0,
      end: 1,
      normal: 2,
    };
    const statusDiff =
      statusOrder[a.seasonStatus] - statusOrder[b.seasonStatus];
    if (statusDiff !== 0) {
      return statusDiff;
    }

    // Within same season status, sort by days left (ascending - shorter seasons first)
    return a.daysLeft - b.daysLeft;
  });

  return sorted.map(({ item, statusBadge }) => ({
    item,
    statusBadge,
  }));
}
