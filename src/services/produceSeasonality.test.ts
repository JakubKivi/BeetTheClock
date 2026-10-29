import { describe, expect, it } from "@jest/globals";
import { PRODUCE_DATA } from "../constants/produce";
import { REGIONS } from "../types";
import { getSeasonality, isAvailableInRegion } from "./produceSeasonality";

describe("regional produce seasonality", () => {
  it("defines Poland retail availability and its domestic best months", () => {
    const beetroot = PRODUCE_DATA.find((produce) => produce.id === "1");

    expect(beetroot).toBeDefined();
    expect(getSeasonality(beetroot!, REGIONS.POLAND)).toEqual({
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      bestMonths: [8, 9, 10, 11],
    });
  });

  it("keeps each best-month selection within the product's availability months", () => {
    expect(
      PRODUCE_DATA.every((produce) => {
        const seasonality = produce.seasonalityByRegion[REGIONS.POLAND];
        return (
          seasonality !== undefined &&
          seasonality.months.length > 0 &&
          new Set(seasonality.months).size === seasonality.months.length &&
          (seasonality.bestMonths ?? []).every((month) =>
            seasonality.months.includes(month),
          )
        );
      }),
    ).toBe(true);
  });

  it("checks availability against the selected region data", () => {
    const asparagus = PRODUCE_DATA.find((produce) => produce.id === "2");

    expect(asparagus).toBeDefined();
    expect(isAvailableInRegion(asparagus!, REGIONS.POLAND, 4)).toBe(true);
    expect(isAvailableInRegion(asparagus!, REGIONS.POLAND, 0)).toBe(false);
  });

  it("includes English and Polish nutrition and recipe content for every product", () => {
    expect(
      PRODUCE_DATA.every(
        (produce) =>
          produce.nutritionalInfo?.startsWith("Per 100 g raw:") &&
          produce.plNutritionalInfo?.startsWith("Na 100 g surowego produktu:") &&
          produce.recipes?.length === 1 &&
          !produce.nutritionalInfo.includes("[sample text]") &&
          Boolean(produce.recipes[0].name && produce.recipes[0].plName) &&
          !produce.recipes[0].instructions.includes("[sample text]") &&
          !produce.recipes[0].plInstructions?.includes("[sample text]"),
      ),
    ).toBe(true);
  });

  it("labels nutrition values that represent only one of multiple varieties", () => {
    const qualifiedProduceIds = ["41", "63", "72", "74", "80"];
    expect(
      qualifiedProduceIds.every((id) => {
        const produce = PRODUCE_DATA.find((item) => item.id === id);
        return Boolean(produce?.nutritionNote?.en && produce.nutritionNote.pl);
      }),
    ).toBe(true);
  });
});
