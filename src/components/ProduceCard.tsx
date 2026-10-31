import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Produce, RegionCode } from "../types";
import { formatMonths } from "../utils/utils";
import { getRarityInfo } from "../constants/produce";
import { i18n } from "../services/i18n";
import { useLanguage } from "../contexts/LanguageContext";
import { DEFAULT_REGION, getSeasonality } from "../services/produceSeasonality";
import { themeColors } from "../constants/theme";
import { AppText as Text } from "./Typography";

const PRODUCE_LOGO = require("../../assets/beet_mini.png");

type Props = {
  item: Produce;
  iconUri?: string;
  region?: RegionCode;
  isFavorite: boolean;
  onPress: () => void;
  onCardPress?: () => void;
  onFavoritePress: () => void;
  statusBadge?: "new" | "end" | "best" | null;
  isAvailable?: boolean;
};

const ICON_SIZE = 40;

const ProduceCard: React.FC<Props> = ({
  item,
  iconUri,
  region = DEFAULT_REGION,
  isFavorite,
  onPress,
  onCardPress,
  onFavoritePress,
  statusBadge,
  isAvailable = true,
}) => {
  const { language } = useLanguage();
  const seasonality = getSeasonality(item, region);

  const monthsLabel = formatMonths(seasonality?.months, language);
  const bestMonthsLabel = seasonality?.bestMonths?.length
    ? `${i18n.t("details.best", language).toUpperCase()}: ${formatMonths(
        seasonality.bestMonths,
        language,
      )}`
    : null;
  const statusColor =
    statusBadge === "new"
      ? themeColors.accent[1]
      : statusBadge === "end"
        ? themeColors.accent[2]
        : statusBadge === "best"
          ? themeColors.semantic.legendary.main
          : undefined;
  const rarityColor = getRarityInfo(item.rarity).color;
  const rarityGradientId = `rarity-gradient-${item.id}`;

  return (
    <View
      testID="produce-card-wrapper"
      style={styles.wrapper}
    >
      <TouchableOpacity
        testID="card-press"
        activeOpacity={0.9}
        onPress={onCardPress}
        style={[
          styles.card,
          statusBadge === "new" && styles.newCard,
          statusBadge === "end" && styles.endCard,
          statusBadge === "best" && styles.bestCard,
        ]}
      >
        <Svg
          testID="rarity-gradient"
          pointerEvents="none"
          style={styles.rarityGradient}
        >
          <Defs>
            <LinearGradient
              id={rarityGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop offset="0%" stopColor={rarityColor} stopOpacity={0.2} />
              <Stop offset="100%" stopColor={themeColors.neutral.white} />
            </LinearGradient>
          </Defs>
          <Rect
            width="100%"
            height="100%"
            rx={10}
            fill={`url(#${rarityGradientId})`}
          />
        </Svg>
        <View style={styles.leftContainer}>
          <View testID="produce-icon-container" style={styles.iconContainer}>
            <View style={styles.iconSlot}>
              {iconUri ? (
                <Image
                  testID="produce-image"
                  source={{ uri: iconUri }}
                  style={[
                    styles.iconImage,
                    {
                      borderWidth: 1,
                      borderColor: rarityColor,
                    },
                  ]}
                />
              ) : (
                <Image
                  testID="produce-default-logo"
                  source={PRODUCE_LOGO}
                  resizeMode="contain"
                  style={styles.defaultLogo}
                />
              )}
            </View>
          </View>

          <View testID="produce-text-container" style={styles.textContainer}>
            <Text
              testID="produce-name"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={[styles.name, !isAvailable && styles.unavailableText]}
            >
              {i18n.tOptional(`produce.${item.id}.name`, language) ?? item.id}
            </Text>
            <Text
              testID="produce-category"
              style={[
                styles.category,
                !isAvailable && styles.unavailableText,
              ]}
            >
              {monthsLabel}
            </Text>
            {bestMonthsLabel && (
              <Text
                testID="best-months-label"
                style={[
                  styles.bestMonths,
                  !isAvailable && styles.unavailableText,
                ]}
              >
                {bestMonthsLabel}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightButtons}>
          <TouchableOpacity
            testID="share-button"
            onPress={onPress}
            style={styles.iconButton}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={themeColors.primary[25]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            testID="favorite-button"
            onPress={onFavoritePress}
            style={styles.iconButton}
          >
            <Ionicons
              testID="favorite-icon"
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={themeColors.primary.main}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {statusBadge && (
        <View
          testID="season-badge"
          pointerEvents="none"
          style={[styles.badgeContainer, { backgroundColor: statusColor }]}
        >
          <Text style={styles.badge}>
            {i18n.t(
              statusBadge === "new"
                ? "season.new"
                : statusBadge === "end"
                  ? "season.end"
                  : "season.best",
              language,
            )}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Wrapper prevents absolute children from being clipped by TouchableOpacity
  wrapper: {
    marginVertical: 3,
    position: "relative",
    overflow: "visible",
  },
  card: {
    backgroundColor: themeColors.neutral.white,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: themeColors.neutral.grey,
  },
  rarityGradient: {
    ...StyleSheet.absoluteFill,
  },
  newCard: {
    borderColor: themeColors.accent[1],
    borderWidth: 2,
  },
  endCard: {
    borderColor: themeColors.accent[2],
    borderWidth: 2,
  },
  bestCard: {
    borderColor: themeColors.semantic.legendary.main,
    borderWidth: 2,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconSlot: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
  },
  iconContainer: {
    position: "relative",
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: -7,
    left: 1,
    backgroundColor: themeColors.primary[25],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    transform: [{ rotate: "-20deg" }],
  },
  badge: {
    color: themeColors.neutral.white,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "bold",
  },
  defaultLogo: {
    width: 32,
    height: 32,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 3,
  },
  unavailableText: {
    color: themeColors.neutral.darkGrey,
  },
  category: {
    fontSize: 10,
    color: themeColors.neutral.darkGrey,
    lineHeight: 12,
  },
  bestMonths: {
    fontSize: 9,
    color: themeColors.neutral.darkGrey,
    lineHeight: 11,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
  },
});

export default ProduceCard;
