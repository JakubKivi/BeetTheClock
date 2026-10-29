import { Language, i18n } from "../services/i18n";
import { MonthOfYear } from "../types";

/**
 * Formats month indices using the selected language. Month indices use the
 * JavaScript convention: January is 0 and December is 11.
 */
export function formatMonths(
  months: MonthOfYear[] | undefined,
  language: Language,
): string {
  if (!months || months.length === 0) return "";

  const unique = Array.from(new Set(months)).sort((a, b) => a - b);

  if (unique.length === 12) return i18n.t("months.yearRound", language);

  const monthNames = new Intl.DateTimeFormat(
    language === "pl" ? "pl-PL" : "en-US",
    { month: "short", timeZone: "UTC" },
  );
  const getMonthName = (month: MonthOfYear) =>
    monthNames
      .format(new Date(Date.UTC(2020, month, 1)))
      .replace(/\.$/, "")
      .toLocaleUpperCase(language === "pl" ? "pl-PL" : "en-US");

  const groups: MonthOfYear[][] = [];
  for (const month of unique) {
    const currentGroup = groups[groups.length - 1];
    if (currentGroup && month === currentGroup[currentGroup.length - 1] + 1) {
      currentGroup.push(month);
    } else {
      groups.push([month]);
    }
  }

  if (groups.length > 1 && unique[0] === 0 && unique[unique.length - 1] === 11) {
    const firstGroup = groups.shift()!;
    const lastGroup = groups.pop()!;
    groups.unshift([...lastGroup, ...firstGroup]);
  }

  return groups
    .map((group) => {
      const start = getMonthName(group[0]);
      const end = getMonthName(group[group.length - 1]);
      return group.length === 1 ? start : `${start} - ${end}`;
    })
    .join(", ");
}
