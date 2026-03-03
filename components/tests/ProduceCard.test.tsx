import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProduceCard from "../ProduceCard";
import { Produce } from "../../types";

const mockProduce: Produce = {
  id: "1",
  name: "Pumpkin",
  months: [9, 10],
  emoji: "🎃",
};

describe("ProduceCard", () => {
  it("renders emoji when no iconUri", () => {
    const { getByText } = render(
      <ProduceCard
        item={mockProduce}
        onPickImage={jest.fn()}
        onPress={jest.fn()}
      />,
    );

    expect(getByText("🎃")).toBeTruthy();
  });

  it("calls onCardPress when the card itself is pressed", () => {
    const onCardPress = jest.fn();
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        onPickImage={jest.fn()}
        onPress={jest.fn()}
        onCardPress={onCardPress}
      />,
    );

    fireEvent.press(getByTestId("card-press"));
    expect(onCardPress).toHaveBeenCalled();
  });

  it("does not call onCardPress when share button pressed", () => {
    const onCardPress = jest.fn();
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        onPickImage={jest.fn()}
        onPress={jest.fn()}
        onCardPress={onCardPress}
      />,
    );

    fireEvent.press(getByTestId("favorite-button"));
    expect(onCardPress).not.toHaveBeenCalled();
  });
});
