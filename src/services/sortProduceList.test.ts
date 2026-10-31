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

  it("orders new, ending, best, and other produce and randomizes within groups", () => {
    const previousMonth = ((currentMonth + 11) % 12) as MonthOfYear;
    const nextMonth = ((currentMonth + 1) % 12) as MonthOfYear;
    const itemWithSeason = (id: string, months: MonthOfYear[]): Produce => ({
      ...produce,
      id,
      seasonalityByRegion: {
        [REGIONS.POLAND]: { months },
      },
    });
    const random = jest.spyOn(Math, "random").mockReturnValue(0);

    try {
      expect(
        sortProduceList(
          [
            itemWithSeason("normal-a", [
              previousMonth,
              currentMonth,
              nextMonth,
            ]),
            {
              ...itemWithSeason("best", Array.from(
                { length: 12 },
                (_, month) => month as MonthOfYear,
              )),
              seasonalityByRegion: {
                [REGIONS.POLAND]: {
                  months: Array.from(
                    { length: 12 },
                    (_, month) => month as MonthOfYear,
                  ),
                  bestMonths: [currentMonth, nextMonth],
                },
              },
            },
            itemWithSeason("new-a", [currentMonth, nextMonth]),
            itemWithSeason("end", [previousMonth, currentMonth]),
            itemWithSeason("new-b", [currentMonth, nextMonth]),
            itemWithSeason("normal-b", [
              previousMonth,
              currentMonth,
              nextMonth,
            ]),
          ],
          currentMonth,
          REGIONS.POLAND,
        ).map(({ item }) => item.id),
      ).toEqual(["new-b", "new-a", "end", "best", "normal-b", "normal-a"]);
      expect(random).toHaveBeenCalled();
    } finally {
      random.mockRestore();
    }
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

  it("marks the first best month for year-round produce", () => {
    const yearRoundProduce: Produce = {
      ...produce,
      seasonalityByRegion: {
        [REGIONS.POLAND]: {
          months: Array.from({ length: 12 }, (_, month) => month as MonthOfYear),
          bestMonths: [currentMonth, ((currentMonth + 1) % 12) as MonthOfYear],
        },
      },
    };
    const nextMonth = ((currentMonth + 1) % 12) as MonthOfYear;

    expect(
      sortProduceList(
        [yearRoundProduce],
        currentMonth,
        REGIONS.POLAND,
      )[0].statusBadge,
    ).toBe("best");
    expect(
      sortProduceList([yearRoundProduce], nextMonth, REGIONS.POLAND)[0]
        .statusBadge,
    ).toBeNull();
  });

  it("does not mark a best month when the produce is not year-round", () => {
    const seasonalProduce: Produce = {
      ...produce,
      seasonalityByRegion: {
        [REGIONS.POLAND]: {
          months: [currentMonth, ((currentMonth + 1) % 12) as MonthOfYear],
          bestMonths: [currentMonth],
        },
      },
    };

    expect(
      sortProduceList(
        [seasonalProduce],
        currentMonth,
        REGIONS.POLAND,
      )[0].statusBadge,
    ).toBe("new");
  });
});
