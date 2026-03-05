import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSettings, saveSettings, AppSettings } from "../services/storage";
import { Produce } from "../types";
import { formatMonths } from "../utils";
import { getRarityInfo } from "../constants/produce";

/**
 * UI card used on the home screen; it just shows the item and a couple of
 * buttons (favorite/share). Any image-picking logic lives at the screen
 * level, so we only accept a simple callback for the share action.
 */

type Props = {
  item: Produce;
  iconUri?: string;
  onPress: () => void; // share
  onCardPress?: () => void; // navigate to details
  statusBadge?: "new" | "last moment" | null;
  isAvailable?: boolean; // true if product is in season, false if coming soon
};

const ICON_SIZE = 40;

const ProduceCard: React.FC<Props> = ({
  item,
  iconUri,
  onPress,
  onCardPress,
  statusBadge,
  isAvailable = true,
}) => {
  const [isFav, setIsFav] = useState(false);
  const BANNER_COLOR = "#6b1d52";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const settings = await getSettings();
        if (!mounted) return;
        setIsFav(!!settings?.favItems?.includes(item.id));
      } catch (e) {
        console.warn("Failed to load favorites", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [item.id]);

  const toggleFavorite = async () => {
    try {
      const settings =
        (await getSettings()) ||
        ({
          phoneNumber: "",
          notificationsEnabled: false,
          favItems: [],
        } as AppSettings);
      const favs = new Set(settings.favItems || []);
      if (favs.has(item.id)) {
        favs.delete(item.id);
      } else {
        favs.add(item.id);
      }
      const newSettings: AppSettings = {
        ...settings,
        favItems: Array.from(favs),
      };
      await saveSettings(newSettings);
      setIsFav(favs.has(item.id));
    } catch (e) {
      console.warn("toggleFavorite error", e);
    }
  };
  const monthsLabel = formatMonths(item.months);
  const bestMonthsLabel = item.best_months
    ? `Best: ${formatMonths(item.best_months)}`
    : null;

  return (
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
          {statusBadge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badge}>{statusBadge}</Text>
            </View>
          )}
          <View style={[styles.rarityBadge]}>
            <Text style={styles.rarityBadgeEmoji}>
              {getRarityInfo(item.rarity).emoji}
            </Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.name, !isAvailable && styles.greyedOutText]}>
            {item.name}
          </Text>
          <Text style={[styles.category, !isAvailable && styles.greyedOutText]}>
            {monthsLabel}
          </Text>
          {bestMonthsLabel && (
            <Text
              style={[styles.bestMonths, !isAvailable && styles.greyedOutText]}
            >
              {bestMonthsLabel}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightButtons}>
        {/* share icon */}
        {onPress && (
          <TouchableOpacity
            testID="share-button"
            onPress={onPress}
            style={styles.iconButton}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={isAvailable ? BANNER_COLOR : "#ccc"}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          testID="favorite-button"
          onPress={toggleFavorite}
          style={styles.iconButton}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={20}
            color={isAvailable ? BANNER_COLOR : "#ccc"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  unavailableCard: {
    backgroundColor: "#f5f5f5",
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
    top: -5,
    left: -5,
    backgroundColor: "#6b1d52",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  badge: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
    transform: [{ rotate: "-15deg" }],
  },
  emptyIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 4,
    borderColor: "#6b1d52",
  },
  unavailableEmptyIcon: {
    borderColor: "#ccc",
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
    color: "#666",
  },
  bestMonths: {
    fontSize: 9,
    color: "#999",
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
