import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import ProduceCard from "./ProduceCard";
import { MonthOfYear, Produce } from "../types";
import { getRarityInfo } from "../constants/produce";
import { FONTS, themeColors } from "../constants/theme";
import { SEASON_REFERENCE_DATE } from "../services/produceSeasonality";

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

  it.each(["new", "end"] as const)(
    "uses the matching accent color for the %s badge and card outline",
    (statusBadge) => {
      const { getByTestId } = render(
        <ProduceCard
          item={mockProduce}
          isFavorite={false}
          onPress={jest.fn()}
          onFavoritePress={jest.fn()}
          statusBadge={statusBadge}
        />,
      );
      const expectedColor =
        statusBadge === "new" ? themeColors.accent[1] : themeColors.accent[2];

      expect(
        StyleSheet.flatten(getByTestId("season-badge").props.style)
          .backgroundColor,
      ).toBe(expectedColor);
      const cardStyle = StyleSheet.flatten(
        getByTestId("card-press").props.style,
      );
      expect(cardStyle.borderColor).toBe(expectedColor);
      expect(cardStyle.borderWidth).toBe(2);
    },
  );

  it("replaces the best badge and outline with highlighted best-month text", () => {
    const { getByTestId, queryByTestId } = render(
      <ProduceCard
        item={{
          ...mockProduce,
          seasonalityByRegion: {
            PL: {
              months: [1, 2],
              bestMonths: [
                SEASON_REFERENCE_DATE.getMonth() as MonthOfYear,
              ],
            },
          },
        }}
        isFavorite={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
        statusBadge="best"
      />,
    );

    const cardStyle = StyleSheet.flatten(getByTestId("card-press").props.style);
    const bestMonthsStyle = StyleSheet.flatten(
      getByTestId("best-months-label").props.style,
    );
    expect(queryByTestId("season-badge")).toBeNull();
    expect(cardStyle.borderWidth).toBe(0.3);
    expect(bestMonthsStyle.color).toBe(themeColors.accent[3]);
    expect(bestMonthsStyle.fontSize).toBeGreaterThan(9);
    expect(bestMonthsStyle.fontWeight).toBe("600");
    expect(getByTestId("best-months-label").props.children).toMatch(/^BEST:/);
  });

  it("uses the third accent color for the outline of every list card", () => {
    const { getByTestId } = render(
      <ProduceCard
        item={mockProduce}
        isFavorite={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
      />,
    );

    const cardStyle = StyleSheet.flatten(getByTestId("card-press").props.style);
    expect(cardStyle.borderColor).toBe(themeColors.accent[3]);
    expect(cardStyle.borderWidth).toBe(0.3);
  });

  it("keeps best-month text neutral when the current month is not a best month", () => {
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
    expect(bestMonthsStyle.fontSize).toBe(9);
    expect(bestMonthsStyle.fontWeight).toBeUndefined();
    expect(bestMonthsStyle.color).toBe(themeColors.neutral.darkGrey);
    expect(bestMonthsStyle.fontStyle).toBeUndefined();
    expect(bestMonthsStyle.fontVariant).toBeUndefined();
    expect(bestMonthsStyle.marginTop).toBeUndefined();
    expect(getByTestId("best-months-label").props.children).toMatch(/^BEST:/);
    expect(getByTestId("favorite-icon").props.color).toBe(
      themeColors.primary.main,
    );
  });

  it("highlights best months only when the current month is among them", () => {
    const { getByTestId } = render(
      <ProduceCard
        item={{
          ...mockProduce,
          seasonalityByRegion: {
            PL: {
              months: [1, 2],
              bestMonths: [
                SEASON_REFERENCE_DATE.getMonth() as MonthOfYear,
              ],
            },
          },
        }}
        isFavorite={false}
        onPress={jest.fn()}
        onFavoritePress={jest.fn()}
      />,
    );

    const bestMonthsStyle = StyleSheet.flatten(
      getByTestId("best-months-label").props.style,
    );
    expect(bestMonthsStyle.fontFamily).toBe(FONTS.bodyBold);
    expect(bestMonthsStyle.fontSize).toBe(10);
    expect(bestMonthsStyle.fontWeight).toBe("600");
    expect(bestMonthsStyle.color).toBe(themeColors.accent[3]);
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
