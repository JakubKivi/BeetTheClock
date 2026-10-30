import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Produce, RegionCode } from "../types";
import { formatMonths } from "../utils/utils";
import { getRarityInfo } from "../constants/produce";
import { i18n } from "../services/i18n";
import { useLanguage } from "../contexts/LanguageContext";
import { DEFAULT_REGION, getSeasonality } from "../services/produceSeasonality";
import { COLORS } from "../constants/theme";
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
  statusBadge?: "new" | "end" | null;
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
      ? COLORS.seasonNew
      : statusBadge === "end"
        ? COLORS.seasonEnd
        : undefined;
  const rarityGlow =
    item.rarity > 1
      ? {
          color: getRarityInfo(item.rarity).color,
        }
      : undefined;

  return (
    <View
      testID="produce-card-wrapper"
      style={[styles.wrapper, statusBadge && styles.badgedWrapper]}
    >
      <TouchableOpacity
        testID="card-press"
        activeOpacity={0.9}
        onPress={onCardPress}
        style={[
          styles.card,
          statusBadge === "new" && styles.newCard,
          statusBadge === "end" && styles.endCard,
        ]}
      >
        <View style={styles.leftContainer}>
          <View testID="produce-icon-container" style={styles.iconContainer}>
            {rarityGlow && (
              <View
                testID="rarity-glow"
                pointerEvents="none"
                style={[
                  styles.rarityGlow,
                  {
                    shadowColor: rarityGlow.color,
                  },
                ]}
              />
            )}
            <View style={styles.iconSlot}>
              {iconUri ? (
                <Image
                  testID="produce-image"
                  source={{ uri: iconUri }}
                  style={styles.iconImage}
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
              {language === "pl" ? item.plName : item.name}
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
          {onPress && (
            <TouchableOpacity
              testID="share-button"
              onPress={onPress}
              style={styles.iconButton}
            >
              <Ionicons
                name="share-social-outline"
                size={20}
                color={COLORS.A_primaryDark}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            testID="favorite-button"
            onPress={onFavoritePress}
            style={styles.iconButton}
          >
            <Ionicons
              testID="favorite-icon"
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color="#6B3255"
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
              statusBadge === "new" ? "season.new" : "season.end",
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
  badgedWrapper: {
    zIndex: 10,
    elevation: 10,
  },
  card: {
    backgroundColor: COLORS.homeCard,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: COLORS.A_Grey,
  },
  newCard: {
    borderColor: COLORS.seasonNew,
    borderWidth: 2,
  },
  endCard: {
    borderColor: COLORS.seasonEnd,
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
  rarityGlow: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 6,
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
    top: -8,
    left: 1,
    backgroundColor: COLORS.A_primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
    elevation: 3,
    transform: [{ rotate: "-20deg" }],
  },
  badge: {
    color: COLORS.white,
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
    color: COLORS.A_darkGrey,
  },
  category: {
    fontSize: 10,
    color: COLORS.secondaryText,
    lineHeight: 12,
  },
  bestMonths: {
    fontSize: 9,
    color: COLORS.A_darkGrey,
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
