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

  it("orders new, ending, current best-month, and other produce", () => {
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

  it("uses the supplied comparator while preserving season badges", () => {
    const first = { ...produce, id: "zucchini" };
    const second = { ...produce, id: "apple" };

    expect(
      sortProduceList(
        [first, second],
        currentMonth,
        REGIONS.POLAND,
        (left, right) => left.id.localeCompare(right.id),
      ),
    ).toEqual([
      { item: second, statusBadge: "new" },
      { item: first, statusBadge: "new" },
    ]);
  });

  it("prioritizes new, ending, current best-month, then other produce before alphabetizing", () => {
    const monthsAroundCurrentMonth = [
      ((currentMonth + 11) % 12) as MonthOfYear,
      currentMonth,
      ((currentMonth + 1) % 12) as MonthOfYear,
    ];
    const itemWithSeason = (
      id: string,
      months: MonthOfYear[],
      bestMonths?: MonthOfYear[],
    ): Produce => ({
      ...produce,
      id,
      seasonalityByRegion: {
        [REGIONS.POLAND]: { months, bestMonths },
      },
    });
    const yearRoundMonths = Array.from(
      { length: 12 },
      (_, month) => month as MonthOfYear,
    );
    const items = [
      itemWithSeason("z-new", [currentMonth, ((currentMonth + 1) % 12) as MonthOfYear]),
      itemWithSeason("b-best", yearRoundMonths, [currentMonth]),
      itemWithSeason("a-best", yearRoundMonths, [currentMonth]),
      itemWithSeason("z-highlight", monthsAroundCurrentMonth, [currentMonth]),
      itemWithSeason("a-highlight", monthsAroundCurrentMonth, [currentMonth]),
      itemWithSeason("z-ending", [
        ((currentMonth + 11) % 12) as MonthOfYear,
        currentMonth,
      ]),
      itemWithSeason("a-new", [currentMonth, ((currentMonth + 1) % 12) as MonthOfYear]),
      itemWithSeason("a-ending", [
        ((currentMonth + 11) % 12) as MonthOfYear,
        currentMonth,
      ]),
      itemWithSeason("other", monthsAroundCurrentMonth),
    ];

    expect(
      sortProduceList(
        items,
        currentMonth,
        REGIONS.POLAND,
        (first, second) => first.id.localeCompare(second.id),
      ).map(({ item }) => item.id),
    ).toEqual([
      "a-new",
      "z-new",
      "a-ending",
      "z-ending",
      "a-best",
      "a-highlight",
      "b-best",
      "z-highlight",
      "other",
    ]);
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
