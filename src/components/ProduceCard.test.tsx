import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import ProduceCard from "./ProduceCard";
import { Produce } from "../types";
import { getRarityInfo } from "../constants/produce";
import { FONTS, themeColors } from "../constants/theme";

jest.mock("../../assets/beet_mini.png", () => "beet-mini-logo");
jest.mock("../contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "en", setLanguage: jest.fn() }),
}));

const mockProduce: Produce = {
  id: "pumpkin",
  rarity: 1,
  seasonalityByRegion: {
    PL: { months: [9, 10] },
  },
};

describe("ProduceCard", () => {
  it("renders the mini beet logo when there is no uploaded produce image", () => {
    const { getByTestId, queryByText, queryByTestId } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
      />,
    );

    const beetLogo = getByTestId("produce-default-logo");
    expect(beetLogo.props.source).toBe("beet-mini-logo");
    expect(getByTestId("rarity-gradient")).toBeTruthy();
    expect(queryByTestId("rarity-glow")).toBeNull();
    expect(StyleSheet.flatten(beetLogo.props.style)).not.toHaveProperty(
      "shadowColor",
    );
    expect(queryByText("⚪")).toBeNull();
  });

  it("lets the seasonal badge overlap the previous row without increasing row height", () => {
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
        statusBadge="new"
      />,
    );

    const wrapperStyle = StyleSheet.flatten(
      getByTestId("produce-card-wrapper").props.style,
    );
    const badgeStyle = StyleSheet.flatten(
      getByTestId("season-badge").props.style,
    );
    expect(wrapperStyle.paddingTop).toBeUndefined();
    expect(wrapperStyle.zIndex).toBeUndefined();
    expect(wrapperStyle.elevation).toBeUndefined();
    expect(wrapperStyle.overflow).toBe("visible");
    expect(badgeStyle.top).toBe(-7);
    expect(badgeStyle.left).toBe(1);
    expect(badgeStyle.paddingHorizontal).toBe(6);
    expect(badgeStyle.paddingVertical).toBe(3);
    expect(badgeStyle.zIndex).toBeUndefined();
    expect(badgeStyle.elevation).toBeUndefined();
    expect(getByTestId("season-badge").props.pointerEvents).toBe("none");

    const badgeTextStyle = StyleSheet.flatten(
      getByTestId("season-badge").props.children.props.style,
    );
    expect(badgeTextStyle.fontSize).toBe(10);
  });

  it("uses the dark legendary color and label for the best badge", () => {
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
        statusBadge="best"
      />,
    );

    expect(
      StyleSheet.flatten(getByTestId("season-badge").props.style)
        .backgroundColor,
    ).toBe(themeColors.semantic.legendary.main);
    const cardStyle = StyleSheet.flatten(getByTestId("card-press").props.style);
    expect(cardStyle.borderColor).toBe(themeColors.semantic.legendary.main);
    expect(cardStyle.borderWidth).toBe(2);
    expect(getByTestId("season-badge").props.children.props.children).toBe(
      "Best",
    );
  });

  it("uses regular text and even spacing for the card content", () => {
    const { getByTestId } = render(
      <ProduceCard
        item={{
          ...mockProduce,
          seasonalityByRegion: {
            PL: { months: [9, 10], bestMonths: [9] },
          },
        }}
        isFavorite
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
      />,
    );

    const bestMonthsStyle = StyleSheet.flatten(
      getByTestId("best-months-label").props.style,
    );
    const iconContainerStyle = StyleSheet.flatten(
      getByTestId("produce-icon-container").props.style,
    );
    const textContainerStyle = StyleSheet.flatten(
      getByTestId("produce-text-container").props.style,
    );
    const nameStyle = StyleSheet.flatten(getByTestId("produce-name").props.style);
    const categoryStyle = StyleSheet.flatten(
      getByTestId("produce-category").props.style,
    );
    const cardStyle = StyleSheet.flatten(getByTestId("card-press").props.style);

    expect(bestMonthsStyle.fontFamily).toBe(FONTS.body);
    expect(cardStyle.padding).toBe(10);
    expect(iconContainerStyle.width).toBe(40);
    expect(textContainerStyle.marginLeft).toBe(10);
    expect(nameStyle.lineHeight).toBe(20);
    expect(categoryStyle.lineHeight).toBe(12);
    expect(bestMonthsStyle.lineHeight).toBe(11);
    expect(bestMonthsStyle.fontStyle).toBeUndefined();
    expect(bestMonthsStyle.fontVariant).toBeUndefined();
    expect(bestMonthsStyle.marginTop).toBeUndefined();
    expect(getByTestId("best-months-label").props.children).toMatch(/^BEST:/);
    expect(getByTestId("favorite-icon").props.color).toBe(
      themeColors.primary.main,
    );
  });

  it("renders a circular uploaded produce image", () => {
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        iconUri="https://example.com/pumpkin.png"
        isFavorite={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
      />,
    );

    const imageStyle = StyleSheet.flatten(
      getByTestId("produce-image").props.style,
    );
    expect(imageStyle.width).toBe(40);
    expect(imageStyle.height).toBe(40);
    expect(imageStyle.borderRadius).toBe(20);
    expect(imageStyle.borderWidth).toBe(1);
    expect(imageStyle.borderColor).toBe(getRarityInfo(mockProduce.rarity).color);
    expect(getByTestId("rarity-gradient")).toBeTruthy();
  });

  it.each([1, 2, 3, 4, 5] as const)(
    "uses a rarity-to-card gradient at rarity %i",
    (rarity) => {
      const { getByTestId, queryByTestId } = render(
        <ProduceCard
          item={{ ...mockProduce, rarity }}
          isFavorite={false}
          onPress={jest.fn()}
          onFavoritePress={jest.fn()}
        />,
      );

      expect(getByTestId("rarity-gradient")).toBeTruthy();
      expect(queryByTestId("rarity-glow")).toBeNull();
    },
  );

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

  it("keeps unavailable produce colorful and configures the name to fit", () => {
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        isAvailable={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
      />,
    );

    const cardStyle = StyleSheet.flatten(
      getByTestId("card-press").props.style,
    );
    const name = getByTestId("produce-name");
    const nameStyle = StyleSheet.flatten(name.props.style);
    const logoStyle = StyleSheet.flatten(
      getByTestId("produce-default-logo").props.style,
    );

    expect(cardStyle.opacity).toBe(1);
    expect(nameStyle.color).toBe(themeColors.neutral.darkGrey);
    expect(nameStyle.opacity).toBeUndefined();
    expect(logoStyle.opacity).toBeUndefined();
    expect(name.props.numberOfLines).toBe(1);
    expect(name.props.adjustsFontSizeToFit).toBe(true);
    expect(name.props.minimumFontScale).toBe(0.75);
  });
});
