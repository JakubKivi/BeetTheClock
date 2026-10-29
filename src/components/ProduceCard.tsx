import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Produce, RegionCode } from "../types";
import { formatMonths } from "../utils/utils";
import { getRarityInfo } from "../constants/produce";
import { i18n } from "../services/i18n";
import { useLanguage } from "../contexts/LanguageContext";
import { DEFAULT_REGION, getSeasonality } from "../services/produceSeasonality";
import { COLORS } from "../constants/theme";

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
    ? `${i18n.t("details.best", language)}: ${formatMonths(
        seasonality.bestMonths,
        language,
      )}`
    : null;

  return (
    <View style={styles.wrapper}>
      {statusBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>
            {i18n.t(
              statusBadge === "new" ? "season.new" : "season.end",
              language,
            )}
          </Text>
        </View>
      )}

      <TouchableOpacity
        testID="card-press"
        activeOpacity={0.9}
        onPress={onCardPress}
        style={[styles.card, !isAvailable && styles.unavailableCard]}
      >
        <View style={styles.leftContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconSlot}>
              {iconUri ? (
                <Image
                  source={{ uri: iconUri }}
                  style={[styles.iconImage, !isAvailable && styles.greyedOut]}
                />
              ) : item.emoji ? (
                <Text
                  style={[styles.emoji, !isAvailable && styles.greyedOutText]}
                >
                  {item.emoji}
                </Text>
              ) : (
                <View
                  style={[
                    styles.emptyIcon,
                    !isAvailable && styles.unavailableEmptyIcon,
                  ]}
                />
              )}
            </View>

            <View style={styles.rarityBadge}>
              <Text style={styles.rarityBadgeEmoji}>
                {getRarityInfo(item.rarity).emoji}
              </Text>
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.name, !isAvailable && styles.greyedOutText]}>
              {language === "pl" ? item.plName : item.name}
            </Text>
            <Text
              style={[styles.category, !isAvailable && styles.greyedOutText]}
            >
              {monthsLabel}
            </Text>
            {bestMonthsLabel && (
              <Text
                style={[
                  styles.bestMonths,
                  !isAvailable && styles.greyedOutText,
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
                color={isAvailable ? COLORS.primary : COLORS.disabled}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            testID="favorite-button"
            onPress={onFavoritePress}
            style={styles.iconButton}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isAvailable ? COLORS.primary : COLORS.disabled}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Wrapper prevents absolute children from being clipped by TouchableOpacity
  wrapper: {
    marginVertical: 8,
    position: "relative",
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unavailableCard: {
    backgroundColor: COLORS.mutedSurface,
    borderColor: "#ddd",
    opacity: 0.6,
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
    borderRadius: 6,
  },
  greyedOut: {
    opacity: 0.5,
  },
  greyedOutText: {
    opacity: 0.5,
  },
  iconContainer: {
    position: "relative",
    width: ICON_SIZE + 10,
    height: ICON_SIZE + 10,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: 5,
    left: 3,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    zIndex: 2,
    elevation: 3,
    transform: [{ rotate: "-20deg" }],
  },
  badge: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "bold",
  },
  emptyIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  unavailableEmptyIcon: {
    borderColor: COLORS.disabled,
  },
  emoji: {
    fontSize: 30,
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  rarityBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
  },
  rarityBadgeEmoji: {
    fontSize: 14,
  },
  category: {
    fontSize: 10,
    color: COLORS.secondaryText,
  },
  bestMonths: {
    fontSize: 9,
    color: COLORS.mutedText,
    marginTop: 2,
    fontStyle: "italic",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 6,
    marginRight: 8,
    borderRadius: 6,
  },
});

export default ProduceCard;
