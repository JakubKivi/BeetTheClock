import { describe, expect, it } from "@jest/globals";
import { NUTRIENT_INFO } from "../constants/nutrition";
import { REGIONS } from "../types";
import { i18n } from "./i18n";
import { getLoadedData } from "./deviceData";
import {
  getSeasonality,
  isAvailableInRegion,
  SEASON_REFERENCE_DATE,
  USE_DEVICE_DATE,
} from "./produceSeasonality";

const LANGUAGES = ["en", "pl"] as const;
const PRODUCE_DATA = getLoadedData()!.produce;

describe("regional produce seasonality", () => {
  it("uses the existing fixed reference date by default", () => {
    expect(USE_DEVICE_DATE).toBe(false);
    expect(SEASON_REFERENCE_DATE).toEqual(new Date(2026, 4, 1));
  });

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

  it("keeps product text in the English and Polish locale resources", () => {
    expect(
      PRODUCE_DATA.every(
        (produce) => {
          const localizedName = LANGUAGES.every((language) =>
            i18n.tOptional(`produce.${produce.id}.name`, language),
          );
          const localizedNutrition = LANGUAGES.every((language) =>
            i18n
              .tOptional(`produce.${produce.id}.nutritionalInfo`, language)
              ?.startsWith(
                language === "pl"
                  ? "Na 100 g surowego produktu:"
                  : "Per 100 g raw:",
              ),
          );
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
            (produce.nutritionItems?.length ?? 0) > 4
          );
        },
      ),
    ).toBe(true);
  });

  it("provides localized labels for selected micronutrients", () => {
    const carrot = PRODUCE_DATA.find((produce) => produce.id === "4");

    expect(carrot?.nutritionItems?.map(({ nutrient }) => nutrient)).toContain(
      "vitaminA",
    );
    expect(carrot?.nutritionItems?.map(({ nutrient }) => nutrient)).toContain(
      "potassium",
    );
  });

  it("labels nutrition values that represent only one of multiple varieties", () => {
    const qualifiedProduceIds = ["41", "63", "72", "74", "80"];
    expect(
      qualifiedProduceIds.every((id) => {
        return LANGUAGES.every((language) =>
          i18n.tOptional(`produce.${id}.nutritionNote`, language),
        );
      }),
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
