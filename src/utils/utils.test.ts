import { describe, expect, it } from "@jest/globals";
import { formatMonths } from "./utils";

describe("formatMonths", () => {
  it("formats month ranges in the selected language", () => {
    expect(formatMonths([9, 10], "en")).toBe("OCT - NOV");
    expect(formatMonths([9, 10], "pl")).toBe("PAŹ - LIS");
  });

  it("merges ranges that cross the end of the year", () => {
    expect(formatMonths([10, 11, 0, 1], "en")).toBe("NOV - FEB");
  });

  it("localizes year-round seasonality", () => {
    const allMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
    expect(formatMonths([...allMonths], "en")).toBe("Year-round");
    expect(formatMonths([...allMonths], "pl")).toBe("Całoroczny");
  });
});
