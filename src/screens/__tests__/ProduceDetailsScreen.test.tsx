import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";
import ProduceDetailsScreen from "../ProduceDetailsScreen";
import { Produce } from "../../types";

const mockProduce: Produce = {
  id: "1",
  name: "Pumpkin",
  plName: "Dynia",
  rarity: 1,
  seasonalityByRegion: {
    PL: { months: [9, 10] },
  },
  emoji: "🎃",
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

describe("ProduceDetailsScreen", () => {
  it("renders the name and emoji when no iconUri", () => {
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;

    const tree = render(
      <NavigationContainer>
        <ProduceDetailsScreen route={route} navigation={undefined as any} />
      </NavigationContainer>,
    );

    expect(tree.getByText("Pumpkin")).toBeTruthy();
    expect(tree.getByText("🎃")).toBeTruthy();
    expect(tree.queryByTestId("recipe-note-default-1")).toBeNull();
    expect(
      tree.getByText(
        "Per 100 g raw: 26 kcal; carbohydrates 6.5 g; fiber 0.5 g; protein 1 g.",
      ),
    ).toBeTruthy();
    expect(tree.getByText("Roast pumpkin with olive oil.")).toBeTruthy();

    // availability months should appear based on data
    expect(tree.getByText("OCT - NOV")).toBeTruthy();
  });

  it("includes best months text when best months are provided", () => {
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

    const { getByText } = render(
      <NavigationContainer>
        <ProduceDetailsScreen route={route} navigation={undefined as any} />
      </NavigationContainer>,
    );

    expect(getByText("OCT - NOV")).toBeTruthy();
    expect(getByText("Best: NOV")).toBeTruthy();
  });

  it("calls onPickImage when image area pressed", () => {
    const onPick = jest.fn().mockResolvedValue("uri://test");
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: onPick,
        onResetIcon: jest.fn(),
      },
    } as any;

    const { getByTestId } = render(
      <NavigationContainer>
        <ProduceDetailsScreen route={route} navigation={undefined as any} />
      </NavigationContainer>,
    );

    fireEvent.press(getByTestId("details-pick-image"));
    expect(onPick).toHaveBeenCalledWith("1");
  });

  it("prompts before resetting and calls onResetIcon when confirmed", () => {
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

    const { getByTestId } = render(
      <NavigationContainer>
        <ProduceDetailsScreen route={route} navigation={undefined as any} />
      </NavigationContainer>,
    );

    fireEvent.press(getByTestId("details-reset-icon"));
    expect(alertSpy).toHaveBeenCalled();
    expect(onReset).toHaveBeenCalledWith("1");

    alertSpy.mockRestore();
  });

  it("shows wikipedia button when url exists and opens link", () => {
    const route = {
      params: {
        item: mockProduce,
        iconUri: undefined,
        onPickImage: jest.fn(),
        onResetIcon: jest.fn(),
      },
    } as any;

    const openSpy = jest.spyOn(require("react-native").Linking, "openURL");

    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <ProduceDetailsScreen route={route} navigation={undefined as any} />
      </NavigationContainer>,
    );

    // button should be present
    expect(getByTestId("details-wikipedia")).toBeTruthy();
    expect(getByText("Wikipedia")).toBeTruthy();

    fireEvent.press(getByTestId("details-wikipedia"));
    expect(openSpy).toHaveBeenCalledWith("https://en.wikipedia.org/wiki/Pumpkin");

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

    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <ProduceDetailsScreen route={route} navigation={undefined as any} />
      </NavigationContainer>,
    );

    expect(getByText("Report an error")).toBeTruthy();
    await act(async () => {
      fireEvent.press(getByTestId("details-report-error"));
    });
    expect(openSpy).toHaveBeenCalledWith("https://jakubkivi.github.io#contact");

    openSpy.mockRestore();
  });
});
