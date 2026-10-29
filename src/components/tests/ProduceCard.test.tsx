import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProduceCard from "../ProduceCard";
import { Produce } from "../../types";

jest.mock("../../../assets/icon.png", () => "app-logo");

const mockProduce: Produce = {
  id: "1",
  name: "Pumpkin",
  plName: "Dynia",
  rarity: 1,
  seasonalityByRegion: {
    PL: { months: [9, 10] },
  },
  emoji: "🎃",
};

describe("ProduceCard", () => {
  it("renders the app logo instead of the produce emoji by default", () => {
    const { getByTestId, queryByText } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
      />,
    );

    expect(getByTestId("produce-default-logo").props.source).toBe("app-logo");
    expect(queryByText("🎃")).toBeNull();
  });

  it("calls onCardPress when the card itself is pressed", () => {
    const onCardPress = jest.fn();
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        onPress={jest.fn()}
        onCardPress={onCardPress}
        onFavoritePress={jest.fn()}
      />,
    );

    fireEvent.press(getByTestId("card-press"));
    expect(onCardPress).toHaveBeenCalled();
  });

  it("does not call onCardPress when favorite button pressed", () => {
    const onCardPress = jest.fn();
    const onFavoritePress = jest.fn();
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        onPress={jest.fn()}
        onCardPress={onCardPress}
        onFavoritePress={onFavoritePress}
      />,
    );

    fireEvent.press(getByTestId("favorite-button"));
    expect(onCardPress).not.toHaveBeenCalled();
    expect(onFavoritePress).toHaveBeenCalled();
  });

  it("calls onPress when share button is pressed", () => {
    const onShare = jest.fn();
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        onPress={onShare}
        onFavoritePress={jest.fn()}
      />,
    );

    fireEvent.press(getByTestId("share-button"));
    expect(onShare).toHaveBeenCalled();
  });
});
