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

  it("keeps localized product text separate from shared nutrition data", () => {
    expect(
      PRODUCE_DATA.every(
        (produce) => {
          const localizedName = LANGUAGES.every((language) =>
            i18n.tOptional(`produce.${produce.id}.name`, language),
          );
          const hasNutritionData =
            (produce.nutritionItems?.length ?? 0) > 0;
          const localizedNutrition = LANGUAGES.every((language) =>
            hasNutritionData
              ? i18n.tOptional("details.nutritionServing", language)
              : i18n.tOptional("details.nutritionUnavailable", language),
          );
          const noLocalizedNutritionData = LANGUAGES.every(
            (language) =>
              i18n.tOptional(
                `produce.${produce.id}.nutritionalInfo`,
                language,
              ) === undefined,
          );
          const localizedNutritionNote =
            produce.nutritionNoteKey === undefined ||
            LANGUAGES.every((language) =>
              i18n.tOptional(
                `details.nutritionProductNote.${produce.nutritionNoteKey}`,
                language,
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
            (recipeId) => {
              const localizedRecipeFields = LANGUAGES.map((language) => ({
                name: i18n.tOptional(
                  `produce.${produce.id}.recipes.${recipeId}.name`,
                  language,
                ),
                instructions: i18n.tOptional(
                  `produce.${produce.id}.recipes.${recipeId}.instructions`,
                  language,
                ),
                raw: i18n.tOptional(
                  `produce.${produce.id}.recipes.${recipeId}.raw`,
                  language,
                ),
              }));
              const hasRawGuidance = localizedRecipeFields.map(({ raw }) =>
                Boolean(raw),
              );

              return (
                localizedRecipeFields.every(
                  ({ name, instructions }) => name && instructions,
                ) &&
                hasRawGuidance[0] === hasRawGuidance[1] &&
                localizedRecipeFields.every(
                  ({ raw }) => !raw || !/^(?:yes|tak)\b/i.test(raw),
                )
              );
            },
          );

          return (
            localizedName &&
            localizedNutrition &&
            noLocalizedNutritionData &&
            localizedNutritionNote &&
            localizedGuides &&
            localizedRecipes &&
            (produce.nutritionItems === undefined ||
              produce.nutritionItems.every(
                ({ amount, nutrient }) =>
                  (amount === undefined || Number.isFinite(amount)) &&
                  NUTRIENT_INFO[nutrient] !== undefined,
              ))
          );
        },
      ),
    ).toBe(true);
  });

  it("omits raw guidance for produce that should not be eaten raw", () => {
    const notForRawConsumption = [
      "5",
      "13",
      "14",
      "39",
      "103",
      "104",
      "119",
      "120",
      "131",
      "133",
      "150",
      "152",
      "158",
      "159",
      "160",
    ];

    expect(
      notForRawConsumption.every((produceId) =>
        LANGUAGES.every(
          (language) =>
            i18n.tOptional(
              `produce.${produceId}.recipes.default-${produceId}.raw`,
              language,
            ) === undefined,
        ),
      ),
    ).toBe(true);
  });

  it("stores quantitative and qualitative carrot nutrients in the region data", () => {
    const carrot = PRODUCE_DATA.find((produce) => produce.id === "4");

    expect(carrot?.nutritionItems).toEqual([
      { nutrient: "energy", amount: 41, unit: "kcal" },
      { nutrient: "carbohydrates", amount: 9.6, unit: "g" },
      { nutrient: "fiber", amount: 2.8, unit: "g" },
      { nutrient: "protein", amount: 0.9, unit: "g" },
      { nutrient: "vitaminA" },
      { nutrient: "vitaminK" },
      { nutrient: "potassium" },
    ]);
    expect(
      i18n.tOptional("produce.4.nutritionalInfo", "en"),
    ).toBeUndefined();
  });

  it("uses the corrected reference values and serving basis from the Polish region", () => {
    const kiwi = PRODUCE_DATA.find((produce) => produce.id === "81");
    const whiteCurrant = PRODUCE_DATA.find((produce) => produce.id === "172");

    expect(kiwi?.nutritionItems?.[0]).toEqual({
      nutrient: "energy",
      amount: 61,
      unit: "kcal",
    });
    expect(whiteCurrant?.nutritionBasis).toBe("freshEdiblePortion");
    expect(whiteCurrant?.nutritionNoteKey).toBe("whiteCurrants");
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
