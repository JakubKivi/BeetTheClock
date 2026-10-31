import { describe, expect, it } from "@jest/globals";
import { MonthOfYear, Produce, REGIONS } from "../types";
import { SEASON_REFERENCE_DATE } from "./produceSeasonality";
import { sortProduceList } from "./sortProduceList";

const currentMonth = SEASON_REFERENCE_DATE.getMonth() as MonthOfYear;
const produce: Produce = {
  id: "in-season",
  seasonalityByRegion: {
    [REGIONS.POLAND]: { months: [currentMonth] },
  },
  rarity: 1,
};

describe("sortProduceList", () => {
  it("uses seasonality for the requested region and skips products without data", () => {
    const withoutRegionalData: Produce = {
      ...produce,
      id: "unknown-region",
      seasonalityByRegion: {},
    };

    expect(
      sortProduceList(
        [withoutRegionalData, produce],
        currentMonth,
        REGIONS.POLAND,
      ).map(({ item }) => item.id),
    ).toEqual(["in-season"]);
  });

  it("preserves input order for products with the same season status", () => {
    const otherProduce: Produce = {
      ...produce,
      id: "other",
    };

    expect(
      sortProduceList(
        [otherProduce, produce],
        currentMonth,
        REGIONS.POLAND,
      ).map(({ item }) => item.id),
    ).toEqual(["other", "in-season"]);
  });

  it("treats a season spanning December and January as one season", () => {
    const winterProduce: Produce = {
      ...produce,
      seasonalityByRegion: {
        [REGIONS.POLAND]: { months: [10, 11, 0, 1] },
      },
    };

    expect(
      sortProduceList([winterProduce], 10, REGIONS.POLAND)[0].statusBadge,
    ).toBe("new");
    expect(
      sortProduceList([winterProduce], 1, REGIONS.POLAND)[0].statusBadge,
    ).toBe("end");
  });
});
