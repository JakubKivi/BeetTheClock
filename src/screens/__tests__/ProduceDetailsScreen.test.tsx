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
import ProduceDetailsScreen from "../ProduceDetailsScreen";
import { getRarityInfo, PRODUCE_DATA } from "../../constants/produce";
import { COLORS } from "../../constants/theme";
import { Produce } from "../../types";
import * as storage from "../../services/storage";

jest.mock("../../contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "en", setLanguage: jest.fn() }),
}));

const mockNavigation = { setOptions: jest.fn() } as any;

const mockProduce: Produce = {
  id: "1",
  name: "Pumpkin",
  plName: "Dynia",
  rarity: 1,
  seasonalityByRegion: {
    PL: { months: [9, 10] },
  },
  wikipediaUrl: "https://en.wikipedia.org/wiki/Pumpkin",
  nutritionalInfo:
    "Per 100 g raw: 26 kcal; carbohydrates 6.5 g; fiber 0.5 g; protein 1 g.",
  plNutritionalInfo:
    "Na 100 g surowego produktu: 26 kcal; węglowodany 6.5 g; błonnik 0.5 g; białko 1 g.",
  recipes: [
    {
      id: "default-1",
      name: "Roasted pumpkin",
      plName: "Pieczona dynia",
      instructions: "Roast pumpkin with olive oil.",
      plInstructions: "Upiecz dynię z oliwą.",
    },
  ],
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
      title: "Pumpkin",
    });

    expect(tree.getByTestId("details-default-image")).toBeTruthy();
    expect(tree.queryByTestId("details-rarity-glow")).toBeNull();
    expect(tree.queryByTestId("details-rarity-aura")).toBeNull();
    expect(tree.queryByTestId("recipe-note-default-1")).toBeNull();
    expect(tree.getByTestId("details-add-produce-note")).toBeTruthy();
    expect(tree.queryByText("My note")).toBeNull();
    expect(
      tree.getByText(
        "Per 100 g raw: 26 kcal; carbohydrates 6.5 g; fiber 0.5 g; protein 1 g.",
      ),
    ).toBeTruthy();
    expect(tree.getByText("Roast pumpkin with olive oil.")).toBeTruthy();

    // availability months should appear based on data
    expect(tree.getByText("OCT - NOV")).toBeTruthy();
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
      expect.objectContaining({ backgroundColor: COLORS.nutritionEnergy }),
    );
    expect(tree.getByTestId("details-nutrient-fiber").props.style).toEqual(
      expect.objectContaining({ backgroundColor: COLORS.nutritionMacros }),
    );
    expect(tree.getByTestId("details-nutrient-vitaminA").props.style).toEqual(
      expect.objectContaining({ backgroundColor: COLORS.nutritionVitamins }),
    );
    expect(tree.getByTestId("details-nutrient-potassium").props.style).toEqual(
      expect.objectContaining({ backgroundColor: COLORS.nutritionMinerals }),
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
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation((_title, _message, buttons) => {
        buttons?.find((button) => button.style === "destructive")?.onPress?.();
      });
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;

    const { findByTestId, getByTestId } = await renderDetailsScreen(route);

    expect(await findByTestId("details-produce-note")).toBeTruthy();
    fireEvent.press(getByTestId("details-delete-produce-note"));

    await waitFor(() => {
      expect(saveNote).toHaveBeenCalledWith("1", null);
      expect(getByTestId("details-add-produce-note")).toBeTruthy();
    });
    expect(getNote).toHaveBeenCalledWith("1");
    expect(alertSpy).toHaveBeenCalled();
    getNote.mockRestore();
    saveNote.mockRestore();
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
      .mockImplementation((title, message, buttons) => {
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

    expect(getByText("Report an error")).toBeTruthy();
    await act(async () => {
      fireEvent.press(getByTestId("details-report-error"));
    });
    expect(openSpy).toHaveBeenCalledWith("https://jakubkivi.github.io#contact");

    openSpy.mockRestore();
  });
});
