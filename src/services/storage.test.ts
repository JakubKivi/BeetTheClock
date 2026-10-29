import AsyncStorage from "@react-native-async-storage/async-storage";
import { describe, expect, it, jest } from "@jest/globals";
import {
  addCustomRecipe,
  AppSettings,
  deleteCustomRecipe,
  getProduceNote,
  migrateSettings,
  saveProduceNote,
  updateCustomRecipe,
} from "./storage";

const makeLegacySettings = (notificationWeekday: number): AppSettings => ({
  phoneNumber: "",
  notificationsEnabled: false,
  notificationFrequency: "weekly",
  notificationWeekday: notificationWeekday as AppSettings["notificationWeekday"],
  favItems: [],
});

describe("settings migration", () => {
  it("converts Sunday-first stored weekdays to Monday-first values", () => {
    const expectedWeekdays = [7, 1, 2, 3, 4, 5, 6];
    expectedWeekdays.forEach((expectedWeekday, index) => {
      expect(
        migrateSettings(makeLegacySettings(index + 1)).notificationWeekday,
      ).toBe(expectedWeekday);
    });

  });

  it("does not convert settings already saved with the current version", () => {
    const settings = {
      ...makeLegacySettings(1),
      settingsVersion: 2,
    };

    expect(migrateSettings(settings)).toBe(settings);
  });
});

describe("custom recipes storage", () => {
  it("saves recipes under the matching produce item in local settings", async () => {
    const settings = {
      ...makeLegacySettings(1),
      settingsVersion: 2,
      customRecipes: {
        "other-product": [
          {
            id: "custom-existing",
            name: "Existing",
            instructions: "Existing instructions",
          },
        ],
        pumpkin: [
          {
            id: "custom-pumpkin",
            name: "Pumpkin soup",
            instructions: "Cook with stock.",
          },
        ],
      },
    };
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(
      JSON.stringify(settings),
    );
    const recipe = {
      id: "custom-new",
      name: "Roasted pumpkin",
      instructions: "Roast until tender.",
    };

    await addCustomRecipe("pumpkin", recipe);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "BeetTheClock:settings",
      JSON.stringify({
        ...settings,
        customRecipes: {
          ...settings.customRecipes,
          pumpkin: [...settings.customRecipes.pumpkin, recipe],
        },
        settingsVersion: 2,
      }),
    );
  });

  describe("local produce notes", () => {
    it("saves and loads a note for the selected produce while preserving recipes", async () => {
      const settings = {
        ...makeLegacySettings(1),
        settingsVersion: 2,
        customRecipes: {
          pumpkin: [
            {
              id: "custom-pumpkin",
              name: "Pumpkin soup",
              instructions: "Cook with stock.",
            },
          ],
        },
      };
      jest.mocked(AsyncStorage.getItem).mockResolvedValue(
        JSON.stringify(settings),
      );

      await saveProduceNote("pumpkin", "  Buy at the farmer's market.  ");

      expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
        "BeetTheClock:settings",
        JSON.stringify({
          ...settings,
          produceNotes: { pumpkin: "Buy at the farmer's market." },
          settingsVersion: 2,
        }),
      );
      jest.mocked(AsyncStorage.getItem).mockResolvedValue(
        JSON.stringify({
          ...settings,
          produceNotes: { pumpkin: "Buy at the farmer's market." },
        }),
      );
      await expect(getProduceNote("pumpkin")).resolves.toBe(
        "Buy at the farmer's market.",
      );
      await expect(getProduceNote("apples")).resolves.toBeNull();
    });

    it("removes an empty note from local settings", async () => {
      const settings = {
        ...makeLegacySettings(1),
        settingsVersion: 2,
        produceNotes: { pumpkin: "Old note", apples: "Keep this note" },
      };
      jest.mocked(AsyncStorage.getItem).mockResolvedValue(
        JSON.stringify(settings),
      );

      await saveProduceNote("pumpkin", null);

      expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
        "BeetTheClock:settings",
        JSON.stringify({
          ...settings,
          produceNotes: { apples: "Keep this note" },
          settingsVersion: 2,
        }),
      );
    });
  });

  it("updates a recipe and its optional note without changing other recipes", async () => {
    const settings = {
      ...makeLegacySettings(1),
      settingsVersion: 2,
      customRecipes: {
        pumpkin: [
          {
            id: "custom-pumpkin",
            name: "Pumpkin soup",
            instructions: "Cook with stock.",
          },
          {
            id: "custom-pie",
            name: "Pumpkin pie",
            instructions: "Bake.",
          },
        ],
      },
    };
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(
      JSON.stringify(settings),
    );
    const updatedRecipe = {
      ...settings.customRecipes.pumpkin[0],
      name: "Roasted pumpkin soup",
      note: "Add nutmeg to taste.",
    };

    await expect(
      updateCustomRecipe("pumpkin", updatedRecipe),
    ).resolves.toEqual([updatedRecipe, settings.customRecipes.pumpkin[1]]);

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      "BeetTheClock:settings",
      JSON.stringify({
        ...settings,
        customRecipes: {
          pumpkin: [updatedRecipe, settings.customRecipes.pumpkin[1]],
        },
        settingsVersion: 2,
      }),
    );
  });

  it("deletes only the selected recipe and removes an empty produce list", async () => {
    const settings = {
      ...makeLegacySettings(1),
      settingsVersion: 2,
      customRecipes: {
        pumpkin: [
          {
            id: "custom-pumpkin",
            name: "Pumpkin soup",
            instructions: "Cook with stock.",
          },
        ],
        apples: [
          {
            id: "custom-apple",
            name: "Apple crumble",
            instructions: "Bake.",
          },
        ],
      },
    };
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(
      JSON.stringify(settings),
    );

    await expect(
      deleteCustomRecipe("pumpkin", "custom-pumpkin"),
    ).resolves.toEqual([]);

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      "BeetTheClock:settings",
      JSON.stringify({
        ...settings,
        customRecipes: { apples: settings.customRecipes.apples },
        settingsVersion: 2,
      }),
    );
  });
});
