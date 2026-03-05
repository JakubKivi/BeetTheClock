// shared utility functions used across the app

const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/**
 * Turn an array of month indices into a human‑readable range string.
 *
 * Handles wrap‑around seasons (e.g. [10, 11, 0, 1] -> "NOV - FEB").
 * If the list contains every month the result is "Year-round".
 */
export function formatMonths(months?: number[]): string {
  if (!months || months.length === 0) return "";

  const unique = Array.from(new Set(months)).sort((a, b) => a - b);
  if (unique.length === 12) return "Year-round";
  if (unique.length === 1) return MONTH_NAMES[unique[0]];

  const ranges: string[] = [];
  let rangeStart = unique[0];

  for (let i = 1; i < unique.length; i++) {
    if (unique[i] !== unique[i - 1] + 1) {
      // close current range
      if (rangeStart === unique[i - 1]) {
        ranges.push(MONTH_NAMES[rangeStart]);
      } else {
        ranges.push(
          `${MONTH_NAMES[rangeStart]} - ${MONTH_NAMES[unique[i - 1]]}`,
        );
      }
      rangeStart = unique[i];
    }
  }

  // finish last range
  if (rangeStart === unique[unique.length - 1]) {
    ranges.push(MONTH_NAMES[rangeStart]);
  } else {
    ranges.push(
      `${MONTH_NAMES[rangeStart]} - ${MONTH_NAMES[unique[unique.length - 1]]}`,
    );
  }

  // merge wrap‑around ranges (e.g. NOV-FEB)
  if (
    ranges.length > 1 &&
    unique[0] <= 6 &&
    unique[unique.length - 1] >= 7 &&
    12 - unique[unique.length - 1] + unique[0] === 1
  ) {
    const lastRange = ranges.pop()!;
    const firstRange = ranges.shift()!;
    const lastStart = lastRange.split(" - ")[0];
    const firstEnd = firstRange.includes(" - ")
      ? firstRange.split(" - ")[1]
      : firstRange;
    ranges.unshift(`${lastStart} - ${firstEnd}`);
  }

  return ranges.join(", ");
}
