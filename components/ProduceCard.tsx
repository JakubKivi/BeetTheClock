import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSettings, saveSettings, AppSettings } from "../services/storage";
import { Produce } from "../types";

type Props = {
  item: Produce;
  iconUri?: string;
  // returns selected uri or null if canceled
  onPickImage?: (id: string) => Promise<string | null>;
  onResetIcon?: (id: string) => void;
  onPress: () => void;
  onCardPress?: () => void; // navigate to details
  statusBadge?: "new" | "last moment" | null;
};

const ICON_SIZE = 40;

const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatMonths(months: number[] | undefined) {
  if (!months || months.length === 0) return "";
  const unique = Array.from(new Set(months)).sort((a, b) => a - b);
  if (unique.length === 12) return "Year-round";
  const first = unique[0];
  const last = unique[unique.length - 1];
  return first === last
    ? MONTH_NAMES[first]
    : `${MONTH_NAMES[first]} - ${MONTH_NAMES[last]}`;
}

const ProduceCard: React.FC<Props> = ({
  item,
  iconUri,
  onPress,
  onCardPress,
  statusBadge,
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
      style={styles.card}
    >
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.iconSlot}>
            {iconUri ? (
              <Image source={{ uri: iconUri }} style={styles.iconImage} />
            ) : item.emoji ? (
              <Text style={styles.emoji}>{item.emoji}</Text>
            ) : (
              <View style={styles.emptyIcon} />
            )}
          </View>
          {statusBadge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badge}>{statusBadge}</Text>
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{monthsLabel}</Text>
          {bestMonthsLabel && (
            <Text style={styles.bestMonths}>{bestMonthsLabel}</Text>
          )}
        </View>
      </View>

      <View style={styles.rightButtons}>
        <TouchableOpacity
          testID="favorite-button"
          onPress={toggleFavorite}
          style={styles.iconButton}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={20}
            color={BANNER_COLOR}
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
  iconContainer: {
    position: "relative", // <--- bardzo ważne
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
  button: {
    backgroundColor: "#6b1d52",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
  resetButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  resetText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
