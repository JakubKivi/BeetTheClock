import { describe, expect, it } from "@jest/globals";
import { PRODUCE_DATA } from "../constants/produce";
import { REGIONS } from "../types";
import { getSeasonality, isAvailableInRegion } from "./produceSeasonality";

describe("regional produce seasonality", () => {
  it("keeps the existing seasonality under the Poland region", () => {
    const beetroot = PRODUCE_DATA.find((produce) => produce.id === "1");

    expect(beetroot).toBeDefined();
    expect(getSeasonality(beetroot!, REGIONS.POLAND)).toEqual({
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      bestMonths: [5, 6],
    });
  });

  it("checks availability against the selected region data", () => {
    const asparagus = PRODUCE_DATA.find((produce) => produce.id === "2");

    expect(asparagus).toBeDefined();
    expect(isAvailableInRegion(asparagus!, REGIONS.POLAND, 4)).toBe(true);
    expect(isAvailableInRegion(asparagus!, REGIONS.POLAND, 0)).toBe(false);
  });

  it("includes sample nutrition and recipe fields for every product", () => {
    expect(
      PRODUCE_DATA.every(
        (produce) =>
          produce.nutritionalInfo === "[sample text]" &&
          produce.recipes?.length === 1 &&
          produce.recipes[0] === "[sample text]",
      ),
    ).toBe(true);
  });
});
