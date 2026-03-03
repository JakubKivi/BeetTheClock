import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";
import ProduceDetailsScreen from "../ProduceDetailsScreen";
import { Produce } from "../../types";

const mockProduce: Produce = {
  id: "1",
  name: "Pumpkin",
  months: [9, 10],
  emoji: "🎃",
  wikipedia_url: "https://en.wikipedia.org/wiki/Pumpkin",
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

    // availability months should appear based on data
    expect(tree.getByText("OCT - NOV")).toBeTruthy();
  });

  it("includes best months text when best_months provided", () => {
    const itemWithBest: Produce = { ...mockProduce, best_months: [10] };
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
});
