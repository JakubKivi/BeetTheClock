import React from "react";
import {
  render,
  fireEvent,
  act,
  waitFor,
  within,
} from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";
import ProduceDetailsScreen from "./ProduceDetailsScreen";
import { getRarityInfo } from "../constants/produce";
import { themeColors } from "../constants/theme";
import { Produce } from "../types";
import * as storage from "../services/storage";
import { getLoadedData } from "../services/deviceData";

const PRODUCE_DATA = getLoadedData()!.produce;

jest.mock("../contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "en", setLanguage: jest.fn() }),
}));

const mockNavigation = { setOptions: jest.fn() } as any;

const mockProduce: Produce = {
  ...PRODUCE_DATA.find((produce) => produce.id === "1")!,
  seasonalityByRegion: {
    PL: { months: [9, 10] },
  },
  wikipediaUrl: "https://en.wikipedia.org/wiki/Pumpkin",
};

const renderDetailsScreen = async (
  route: React.ComponentProps<typeof ProduceDetailsScreen>["route"],
) => {
  const tree = render(
    <NavigationContainer>
      <ProduceDetailsScreen route={route} navigation={mockNavigation} />
    </NavigationContainer>,
  );
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  });
  return tree;
};

describe("ProduceDetailsScreen", () => {
  it("sets the produce title and renders the beet logo when no iconUri", async () => {
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;

    const tree = await renderDetailsScreen(route);

    expect(mockNavigation.setOptions).toHaveBeenCalledWith({
      title: "Beetroot",
    });

    expect(tree.getByTestId("details-default-image")).toBeTruthy();
    const glowStyle = StyleSheet.flatten(
      tree.getByTestId("details-rarity-glow").props.style,
    );
    expect(glowStyle.shadowColor).toBe(getRarityInfo(mockProduce.rarity).color);
    expect(tree.getByTestId("details-rarity-aura")).toBeTruthy();
    expect(tree.queryByTestId("recipe-note-default-1")).toBeNull();
    expect(tree.getByTestId("details-add-produce-note")).toBeTruthy();
    expect(tree.queryByText("My note")).toBeNull();
    expect(tree.getByTestId("details-nutrient-energy")).toBeTruthy();
    expect(
      tree.getByText(
        "Roast beet wedges with olive oil, thyme, and a little vinegar until tender.",
      ),
    ).toBeTruthy();

    // availability months should appear based on data
    expect(tree.getByText("OCT - NOV")).toBeTruthy();
  });

  it("renders guide sections as bordered cards on the light-gray screen", async () => {
    const tree = await renderDetailsScreen({
      params: { item: mockProduce },
    } as any);

    expect(
      StyleSheet.flatten(tree.getByTestId("details-screen").props.style)
        .backgroundColor,
    ).toBe(themeColors.neutral.lightGrey);
    expect(
      StyleSheet.flatten(
        tree.getByTestId("details-screen").props.contentContainerStyle,
      ).paddingBottom,
    ).toBe(100);

    for (const testID of [
      "details-selection-guide-card",
      "details-storage-guide-card",
      "details-nutrition-card",
      "details-recipes-card",
    ]) {
      expect(
        StyleSheet.flatten(tree.getByTestId(testID).props.style),
      ).toEqual(
        expect.objectContaining({
          backgroundColor: themeColors.neutral.white,
          borderRadius: 10,
          borderWidth: 1,
          padding: 10,
        }),
      );
    }

    expect(
      StyleSheet.flatten(
        tree
          .getByText(
            "Firm, smooth skin, intact taproot. For greens attached, leaves should be fresh not wilted.",
          ).props.style,
      )
        .fontSize,
    ).toBe(12);
  });

  it("uses the beet logo fallback and displays the produce rarity", async () => {
    const topinambur = PRODUCE_DATA.find((produce) => produce.id === "49");
    expect(topinambur).toBeDefined();
    const route = {
      params: {
        item: topinambur!,
      },
    } as any;

    const tree = await renderDetailsScreen(route);

    expect(tree.getByTestId("details-default-image")).toBeTruthy();
    expect(tree.getByTestId("details-rarity").props.children).toBe(
      getRarityInfo(topinambur!.rarity).label.toUpperCase(),
    );
  });

  it("renders a circular image with an extended rarity-colored glow and SVG aura", async () => {
    const legendaryProduce = { ...mockProduce, rarity: 5 as const };
    const route = {
      params: { item: legendaryProduce, iconUri: "file://produce.png" },
    } as any;

    const tree = await renderDetailsScreen(route);
    const imageStyle = StyleSheet.flatten(
      tree.getByTestId("details-produce-image").props.style,
    );
    const glowStyle = StyleSheet.flatten(
      tree.getByTestId("details-rarity-glow").props.style,
    );
    const aura = tree.getByTestId("details-rarity-aura");

    expect(imageStyle).toEqual(
      expect.objectContaining({
        width: 204,
        height: 204,
        borderRadius: 102,
      }),
    );
    expect(glowStyle.shadowColor).toBe(getRarityInfo(5).color);
    expect(glowStyle.shadowRadius).toBeGreaterThan(30);
    expect(glowStyle.elevation).toBeGreaterThan(10);
    expect(aura.props.width).toBeGreaterThan(imageStyle.width);
    expect(aura.props.height).toBeGreaterThan(imageStyle.height);
    expect(tree.queryByTestId("details-rarity-ring")).toBeNull();
    expect(tree.queryByTestId("details-rarity-aura")).toBeTruthy();
    expect(tree.getByTestId("details-rarity").props.children).toBe("LEGENDARY");
  });

  it("renders nutrients in separate, themed category rows", async () => {
    const carrot = PRODUCE_DATA.find((produce) => produce.id === "4");
    expect(carrot).toBeDefined();
    const route = { params: { item: carrot! } } as any;

    const tree = await renderDetailsScreen(route);

    const energyGroup = tree.getByTestId("details-nutrition-group-energy");
    const macrosGroup = tree.getByTestId("details-nutrition-group-macros");
    const vitaminsGroup = tree.getByTestId("details-nutrition-group-vitamins");
    const mineralsGroup = tree.getByTestId("details-nutrition-group-minerals");
    expect(within(energyGroup).getByTestId("details-nutrient-energy")).toBeTruthy();
    expect(within(macrosGroup).getByTestId("details-nutrient-fiber")).toBeTruthy();
    expect(within(vitaminsGroup).getByTestId("details-nutrient-vitaminA")).toBeTruthy();
    expect(within(mineralsGroup).getByTestId("details-nutrient-potassium")).toBeTruthy();
    expect(tree.getByTestId("details-nutrient-energy").props.style).toEqual(
      expect.objectContaining({
        backgroundColor: themeColors.semantic.uncommon[100],
      }),
    );
    expect(tree.getByTestId("details-nutrient-fiber").props.style).toEqual(
      expect.objectContaining({
        backgroundColor: themeColors.semantic.epic[100],
      }),
    );
    expect(tree.getByTestId("details-nutrient-vitaminA").props.style).toEqual(
      expect.objectContaining({
        backgroundColor: themeColors.semantic.legendary[100],
      }),
    );
    expect(tree.getByTestId("details-nutrient-potassium").props.style).toEqual(
      expect.objectContaining({
        backgroundColor: themeColors.semantic.rare[100],
      }),
    );
  });

  it("adds a produce note and displays it in its card", async () => {
    const saveNote = jest
      .spyOn(storage, "saveProduceNote")
      .mockResolvedValue();
    const getNote = jest
      .spyOn(storage, "getProduceNote")
      .mockResolvedValue(null);
    jest.spyOn(storage, "getCustomRecipes").mockResolvedValue([]);
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;

    const { getByTestId, findByTestId } = await renderDetailsScreen(route);

    expect(getNote).toHaveBeenCalledWith("1");
    fireEvent.press(getByTestId("details-add-produce-note"));
    expect(
      StyleSheet.flatten(
        getByTestId("details-save-produce-note").props.style,
      ).backgroundColor,
    ).toBe(themeColors.primary.main);
    fireEvent.changeText(
      getByTestId("details-produce-note-input"),
      "Buy from the local market.",
    );
    await act(async () => {
      fireEvent.press(getByTestId("details-save-produce-note"));
    });

    expect(saveNote).toHaveBeenCalledWith("1", "Buy from the local market.");
    expect(await findByTestId("details-produce-note")).toBeTruthy();
    expect(getByTestId("details-edit-produce-note")).toBeTruthy();
    expect(getByTestId("details-delete-produce-note")).toBeTruthy();
    saveNote.mockRestore();
  });

  it("shows a saved produce note and returns to the add button after deleting it", async () => {
    const getNote = jest
      .spyOn(storage, "getProduceNote")
      .mockResolvedValue("Buy from the local market.");
    const saveNote = jest
      .spyOn(storage, "saveProduceNote")
      .mockResolvedValue();
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;

    const { findByTestId, getByTestId, getByText, queryByTestId } =
      await renderDetailsScreen(route);

    expect(await findByTestId("details-produce-note")).toBeTruthy();
    expect(getByText("Note")).toBeTruthy();
    expect(
      StyleSheet.flatten(getByTestId("details-wikipedia").props.style)
        .backgroundColor,
    ).toBe(themeColors.primary.main);
    expect(
      StyleSheet.flatten(getByTestId("details-report-error").props.style)
        .backgroundColor,
    ).toBe(themeColors.primary.main);
    fireEvent.press(getByTestId("details-delete-produce-note"));
    expect(getByTestId("details-confirm-delete-produce-note")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        getByTestId("details-confirm-delete-produce-note").props.style,
      ).backgroundColor,
    ).toBe(themeColors.primary.main);
    expect(getByText("Delete note?")).toBeTruthy();
    expect(getByText("Confirm")).toBeTruthy();

    fireEvent.press(getByTestId("details-cancel-delete-produce-note"));
    expect(getByTestId("details-produce-note")).toBeTruthy();
    expect(saveNote).not.toHaveBeenCalled();

    fireEvent.press(getByTestId("details-delete-produce-note"));
    fireEvent.press(getByTestId("details-confirm-delete-produce-note"));

    await waitFor(() => {
      expect(saveNote).toHaveBeenCalledWith("1", null);
      expect(getByTestId("details-add-produce-note")).toBeTruthy();
      expect(queryByTestId("details-confirm-delete-produce-note")).toBeNull();
    });
    expect(getNote).toHaveBeenCalledWith("1");
    getNote.mockRestore();
    saveNote.mockRestore();
  });

  it("edits a saved produce note", async () => {
    const getNote = jest
      .spyOn(storage, "getProduceNote")
      .mockResolvedValue("Buy from the local market.");
    const saveNote = jest
      .spyOn(storage, "saveProduceNote")
      .mockResolvedValue();
    const getRecipes = jest
      .spyOn(storage, "getCustomRecipes")
      .mockResolvedValue([]);
    const route = { params: { item: mockProduce } } as any;

    const { findByTestId, getByTestId } = await renderDetailsScreen(route);

    expect(await findByTestId("details-produce-note")).toBeTruthy();
    fireEvent.press(getByTestId("details-edit-produce-note"));
    fireEvent.changeText(
      getByTestId("details-produce-note-input"),
      "Buy from the market on Saturday.",
    );
    await act(async () => {
      fireEvent.press(getByTestId("details-save-produce-note"));
    });

    expect(saveNote).toHaveBeenCalledWith(
      "1",
      "Buy from the market on Saturday.",
    );
    expect(getByTestId("details-produce-note").props.children).toBe(
      "Buy from the market on Saturday.",
    );
    getNote.mockRestore();
    saveNote.mockRestore();
    getRecipes.mockRestore();
  });

  it("edits a custom recipe without exposing recipe note controls", async () => {
    const existingRecipe = {
      id: "custom-pumpkin",
      name: "Pumpkin soup",
      instructions: "Cook with stock.",
      note: "Add pepper.",
    };
    const updatedRecipe = {
      ...existingRecipe,
      name: "Roasted pumpkin soup",
      instructions: "Roast and blend.",
    };
    const getRecipes = jest
      .spyOn(storage, "getCustomRecipes")
      .mockResolvedValue([existingRecipe]);
    const getNote = jest
      .spyOn(storage, "getProduceNote")
      .mockResolvedValue(null);
    const updateRecipe = jest
      .spyOn(storage, "updateCustomRecipe")
      .mockResolvedValue([updatedRecipe]);
    const route = { params: { item: mockProduce } } as any;

    const { findByTestId, getByTestId, queryByTestId } =
      await renderDetailsScreen(route);

    expect(await findByTestId("recipe-edit-custom-pumpkin")).toBeTruthy();
    fireEvent.press(getByTestId("recipe-edit-custom-pumpkin"));
    expect(queryByTestId("recipe-add-note")).toBeNull();
    expect(queryByTestId("recipe-note-input")).toBeNull();
    expect(
      StyleSheet.flatten(getByTestId("recipe-save").props.style)
        .backgroundColor,
    ).toBe(themeColors.primary.main);
    fireEvent.changeText(
      getByTestId("recipe-name-input"),
      updatedRecipe.name,
    );
    fireEvent.changeText(
      getByTestId("recipe-instructions-input"),
      updatedRecipe.instructions,
    );
    await act(async () => {
      fireEvent.press(getByTestId("recipe-save"));
    });

    expect(updateRecipe).toHaveBeenCalledWith("1", {
      ...updatedRecipe,
      note: existingRecipe.note,
    });
    expect(getByTestId("recipe-edit-custom-pumpkin")).toBeTruthy();
    expect(queryByTestId("recipe-note-custom-pumpkin")).toBeNull();
    fireEvent.press(getByTestId("details-add-recipe"));
    expect(queryByTestId("recipe-add-note")).toBeNull();
    expect(queryByTestId("recipe-note-input")).toBeNull();
    getRecipes.mockRestore();
    getNote.mockRestore();
    updateRecipe.mockRestore();
  });

  it("confirms before deleting a custom recipe", async () => {
    const customRecipe = {
      id: "custom-pumpkin",
      name: "Pumpkin soup",
      instructions: "Cook with stock.",
    };
    const getRecipes = jest
      .spyOn(storage, "getCustomRecipes")
      .mockResolvedValue([customRecipe]);
    const getNote = jest
      .spyOn(storage, "getProduceNote")
      .mockResolvedValue(null);
    const deleteRecipe = jest
      .spyOn(storage, "deleteCustomRecipe")
      .mockResolvedValue([]);
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation((_title, _message, buttons) => {
        buttons?.find((button) => button.style === "destructive")?.onPress?.();
      });
    const route = { params: { item: mockProduce } } as any;

    const { findByTestId, queryByTestId, getByTestId } =
      await renderDetailsScreen(route);

    expect(await findByTestId("recipe-delete-custom-pumpkin")).toBeTruthy();
    fireEvent.press(getByTestId("recipe-delete-custom-pumpkin"));

    await waitFor(() => {
      expect(deleteRecipe).toHaveBeenCalledWith("1", "custom-pumpkin");
      expect(queryByTestId("recipe-edit-custom-pumpkin")).toBeNull();
    });
    expect(alertSpy).toHaveBeenCalled();
    getRecipes.mockRestore();
    getNote.mockRestore();
    deleteRecipe.mockRestore();
    alertSpy.mockRestore();
  });

  it("includes best months text when best months are provided", async () => {
    const itemWithBest: Produce = {
      ...mockProduce,
      seasonalityByRegion: {
        PL: { months: [9, 10], bestMonths: [10] },
      },
    };
    const route = {
      params: {
        item: itemWithBest,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;

    const { getByText } = await renderDetailsScreen(route);

    expect(getByText("OCT - NOV")).toBeTruthy();
    expect(getByText("Best: NOV")).toBeTruthy();
  });

  it("calls onPickImage when image area pressed", async () => {
    const onPick = jest.fn().mockResolvedValue("uri://test");
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: onPick,
        onResetIcon: jest.fn(),
      },
    } as any;

    const { getByTestId } = await renderDetailsScreen(route);

    await act(async () => {
      fireEvent.press(getByTestId("details-set-image"));
    });
    expect(onPick).toHaveBeenCalledWith("1");
  });

  it("prompts before resetting and calls onResetIcon when confirmed", async () => {
    const onReset = jest.fn();
    const route = {
      params: {
        item: mockProduce,
        iconUri: "uri://existing",
        onPickImage: jest.fn(),
        onResetIcon: onReset,
      },
    } as any;

    // spy on Alert and immediately invoke the OK handler
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation((_title, message, buttons) => {
        // ensure message contains our confirmation text
        expect(message).toBe("Are you sure?");
        // simulate pressing OK button
        const ok = buttons?.find((b: any) => b.text === "OK");
        if (ok && ok.onPress) {
          ok.onPress();
        }
      });

    const { getByTestId } = await renderDetailsScreen(route);

    fireEvent.press(getByTestId("details-reset-icon"));
    expect(alertSpy).toHaveBeenCalled();
    expect(onReset).toHaveBeenCalledWith("1");

    alertSpy.mockRestore();
  });

  it("shows wikipedia button when url exists and opens link", async () => {
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;

    const openSpy = jest.spyOn(require("react-native").Linking, "openURL");

    const { getByTestId, getByText } = await renderDetailsScreen(route);

    // button should be present
    expect(getByTestId("details-wikipedia")).toBeTruthy();
    expect(getByText("Wikipedia")).toBeTruthy();

    fireEvent.press(getByTestId("details-wikipedia"));
    expect(openSpy).toHaveBeenCalledWith("https://en.wikipedia.org/wiki/Pumpkin");

    openSpy.mockRestore();
  });

  it("opens a localized nutrient popup and closes it", async () => {
    const carrot = PRODUCE_DATA.find((produce) => produce.id === "4");
    expect(carrot).toBeDefined();
    const route = {
      params: {
        item: carrot!,
        iconUri: undefined,
      },
    } as any;

    const { getByTestId, queryByTestId } = await renderDetailsScreen(route);

    fireEvent.press(getByTestId("details-nutrient-vitaminA"));
    const nutrientModal = getByTestId("details-nutrient-modal");
    expect(within(nutrientModal).getByText("Vitamin A")).toBeTruthy();
    expect(
      within(nutrientModal).getByText(
        "Vitamin A helps the eyes adapt to dim light and supports immune defenses and healthy skin and tissues. Severe deficiency can impair night vision and increase susceptibility to infections.",
      ),
    ).toBeTruthy();
    expect(getByTestId("details-nutrient-wikipedia")).toBeTruthy();

    fireEvent.press(getByTestId("details-nutrient-close"));
    expect(queryByTestId("details-nutrient-modal")).toBeNull();
  });

  it("opens the selected nutrient's Wikipedia page", async () => {
    const carrot = PRODUCE_DATA.find((produce) => produce.id === "4");
    const route = { params: { item: carrot! } } as any;
    const openSpy = jest
      .spyOn(require("react-native").Linking, "openURL")
      .mockResolvedValue(true);
    const { getByTestId } = await renderDetailsScreen(route);

    fireEvent.press(getByTestId("details-nutrient-vitaminA"));
    await act(async () => {
      fireEvent.press(getByTestId("details-nutrient-wikipedia"));
    });

    expect(openSpy).toHaveBeenCalledWith(
      "https://en.wikipedia.org/wiki/Vitamin_A",
    );
    openSpy.mockRestore();
  });

  it("opens the contact page from the report-error button", async () => {
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;
    const openSpy = jest
      .spyOn(require("react-native").Linking, "openURL")
      .mockResolvedValue(true);

    const { getByTestId, getByText } = await renderDetailsScreen(route);

    expect(getByText("Report an issue")).toBeTruthy();
    await act(async () => {
      fireEvent.press(getByTestId("details-report-error"));
    });
    expect(openSpy).toHaveBeenCalledWith("https://jakubkivi.github.io#contact");

    openSpy.mockRestore();
  });
});
