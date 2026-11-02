import { describe, expect, it } from "@jest/globals";
import { NUTRIENT_INFO } from "../constants/nutrition";
import { REGIONS } from "../types";
import { i18n } from "./i18n";
import { getLoadedData } from "./deviceData";
import {
  getSeasonality,
  isAvailableInRegion,
} from "./produceSeasonality";

const LANGUAGES = ["en", "pl"] as const;
const PRODUCE_DATA = getLoadedData()!.produce;

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
          seasonality.months.every(
            (month) => Number.isInteger(month) && month >= 0 && month <= 11,
          ) &&
          new Set(seasonality.months).size === seasonality.months.length &&
          (seasonality.bestMonths?.length ?? 0) <= 4 &&
          (seasonality.bestMonths ?? []).every((month) =>
            seasonality.months.includes(month),
          )
        );
      }),
    ).toBe(true);
  });

  it("does not force a best season for year-round kiwi imports", () => {
    const kiwi = PRODUCE_DATA.find((produce) => produce.id === "81");

    expect(kiwi).toBeDefined();
    expect(getSeasonality(kiwi!, REGIONS.POLAND)?.bestMonths).toBeUndefined();
  });

  it("checks availability against the selected region data", () => {
    const asparagus = PRODUCE_DATA.find((produce) => produce.id === "2");

    expect(asparagus).toBeDefined();
    expect(isAvailableInRegion(asparagus!, REGIONS.POLAND, 4)).toBe(true);
    expect(isAvailableInRegion(asparagus!, REGIONS.POLAND, 0)).toBe(false);
  });

  it("keeps product text in the English and Polish locale resources", () => {
    expect(
      PRODUCE_DATA.every(
        (produce) => {
          const localizedName = LANGUAGES.every((language) =>
            i18n.tOptional(`produce.${produce.id}.name`, language),
          );
          const hasQuantitativeNutrition =
            (produce.nutritionItems?.length ?? 0) > 0;
          const localizedNutrition = LANGUAGES.every((language) => {
            const text = i18n.tOptional(
              `produce.${produce.id}.nutritionalInfo`,
              language,
            );
            if (!text) return false;
            if (!hasQuantitativeNutrition) {
              return language === "pl"
                ? text.startsWith(
                    "Brak zweryfikowanej wartości liczbowej",
                  )
                : text.startsWith(
                    "No verified quantitative reference",
                  );
            }
            return language === "pl"
              ? /^Na 100 g (?:surow[^:]*|świeżej części jadalnej):/.test(text)
              : /^Per 100 g (?:raw[^:]*|fresh edible portion):/.test(text);
          });
          const localizedGuides = LANGUAGES.every(
            (language) =>
              i18n.tOptional(
                `produce.${produce.id}.selectionGuide`,
                language,
              ) &&
              i18n.tOptional(
                `produce.${produce.id}.storageGuide`,
                language,
              ),
          );
          const localizedRecipes = (produce.defaultRecipeIds ?? []).every(
            (recipeId) =>
              LANGUAGES.every(
                (language) =>
                  i18n.tOptional(
                    `produce.${produce.id}.recipes.${recipeId}.name`,
                    language,
                  ) &&
                  i18n.tOptional(
                    `produce.${produce.id}.recipes.${recipeId}.instructions`,
                    language,
                  ),
              ),
          );

          return (
            localizedName &&
            localizedNutrition &&
            localizedGuides &&
            localizedRecipes &&
            (produce.nutritionItems === undefined ||
              produce.nutritionItems.every(
                ({ amount, nutrient }) =>
                  Number.isFinite(amount) && NUTRIENT_INFO[nutrient] !== undefined,
              ))
          );
        },
      ),
    ).toBe(true);
  });

  it("uses only verified quantitative nutrition data for carrots", () => {
    const carrot = PRODUCE_DATA.find((produce) => produce.id === "4");

    expect(carrot?.nutritionItems).toEqual([
      { nutrient: "energy", amount: 41, unit: "kcal" },
      { nutrient: "carbohydrates", amount: 9.6, unit: "g" },
      { nutrient: "fiber", amount: 2.8, unit: "g" },
      { nutrient: "protein", amount: 0.9, unit: "g" },
    ]);
    expect(
      i18n.tOptional("produce.4.nutritionalInfo", "en"),
    ).toContain("vitamin A");
    expect(
      i18n.tOptional("produce.4.nutritionalInfo", "en"),
    ).toContain("amounts not provided");
    expect(carrot?.nutritionItems?.some(({ nutrient }) =>
      ["vitaminA", "potassium"].includes(nutrient),
    )).toBe(false);
  });

  it("uses one global nutrition note instead of per-product notes", () => {
    expect(
      LANGUAGES.every((language) =>
        i18n.tOptional("details.nutritionNote", language),
      ),
    ).toBe(true);
    expect(
      PRODUCE_DATA.every((produce) =>
        LANGUAGES.every(
          (language) =>
            i18n.tOptional(
              `produce.${produce.id}.nutritionNote`,
              language,
            ) === undefined,
        ),
      ),
    ).toBe(true);
  });

  it("provides concise descriptions of each nutrient in both languages", () => {
    expect(
      Object.values(NUTRIENT_INFO).every(({ description }) =>
        [description.en, description.pl].every(
          (text) => (text.match(/[.!?](?:\s|$)/g) ?? []).length <= 3,
        ),
      ),
    ).toBe(true);

    expect(NUTRIENT_INFO.carbohydrates.description.pl).toContain("glukozy");
    expect(NUTRIENT_INFO.carbohydrates.description.pl).toContain("mózgowi");
  });
});
