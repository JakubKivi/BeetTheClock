import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Produce } from "../types";
import { formatMonths } from "../utils/utils";
import { getRarityInfo } from "../constants/produce";
import { useLanguage } from "../contexts/LanguageContext";
import { i18n } from "../services/i18n";

// define the types for route params
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Details: {
    item: Produce;
    iconUri?: string;
    // callback invoked when the user wants to choose a custom icon;
    // returns a promise resolving to the selected URI (or null if
    // the operation was cancelled).  Made optional so callers who
    // don't support image picking can omit it and so that the
    // component's runtime guards make sense.
    onPickImage?: (id: string) => Promise<string | null>;
    onResetIcon?: (id: string) => void;
  };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;

type DetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Details"
>;

type Props = {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
};

const ICON_SIZE = 120;

const ProduceDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { language } = useLanguage();
  const {
    item,
    iconUri: initialIconUri,
    onPickImage,
    onResetIcon,
  } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: language === "pl" ? item.pl_name : item.name,
    });
  }, [navigation, language === "pl" ? item.pl_name : item.name]);
  const isFocused = useIsFocused();

  const [iconUri, setIconUri] = useState<string | undefined>(initialIconUri);

  // when screen is focused we might want to sync any changes that happened elsewhere
  useEffect(() => {
    if (isFocused) {
      setIconUri(initialIconUri);
    }
  }, [isFocused, initialIconUri]);

  const handlePick = async () => {
    if (onPickImage) {
      const newUri = await onPickImage(item.id);
      if (newUri) {
        setIconUri(newUri);
      }
    }
  };

  const handleReset = () => {
    // ask user before actually clearing the icon
    Alert.alert(
      i18n.t("details.confirmReset"),
      i18n.t("details.areYouSure"),
      [
        { text: i18n.t("details.cancel"), style: "cancel" },
        {
          text: i18n.t("details.ok"),
          onPress: () => {
            if (onResetIcon) {
              onResetIcon(item.id);
              setIconUri(undefined);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.name}>
        {language === "pl" ? item.pl_name : item.name}
      </Text>

      <View style={styles.rarityImageRow}>
        {/* Rarity Circle */}
        <View style={[styles.rarityCircle]}>
          <Text style={styles.rarityCircleEmoji}>
            {getRarityInfo(item.rarity).emoji}
          </Text>
        </View>

        {/* Image Container */}
        <View style={styles.iconContainerInRow}>
          <TouchableOpacity style={styles.iconSlot} testID="details-pick-image">
            {iconUri ? (
              <Image source={{ uri: iconUri }} style={styles.iconImage} />
            ) : item.emoji ? (
              <Text style={styles.emoji}>{item.emoji}</Text>
            ) : (
              <View style={styles.emptyIcon} />
            )}
          </TouchableOpacity>
          {!iconUri && onPickImage && (
            <TouchableOpacity
              testID="details-set-image"
              style={styles.setImageButton}
              onPress={handlePick}
            >
              <Ionicons name="image-outline" size={22} color="#6b1d52" />
            </TouchableOpacity>
          )}

          {iconUri && onResetIcon && (
            <TouchableOpacity
              testID="details-reset-icon"
              onPress={handleReset}
              style={styles.resetIconButton}
            >
              <Ionicons name="close" size={18} color="#6b1d52" />
            </TouchableOpacity>
          )}
        </View>

        {/* Rarity Text */}
        <View style={styles.rarityTextContainer}>
          <Text
            style={[
              styles.rarityText,
              { color: getRarityInfo(item.rarity).color },
            ]}
          >
            {language === "pl"
              ? getRarityInfo(item.rarity).pl_label
              : getRarityInfo(item.rarity).label}
          </Text>
        </View>
      </View>

      {/* availability months and best months */}
      {item.months && item.months.length > 0 && (
        <View style={styles.monthsSection}>
          <Text style={styles.monthsLabel}>{formatMonths(item.months)}</Text>
          {item.best_months && item.best_months.length > 0 && (
            <Text style={styles.bestMonthsLabel}>
              {i18n.t("details.best")}: {formatMonths(item.best_months)}
            </Text>
          )}
        </View>
      )}

      {item.selection_guide && (
        <View style={styles.guideSection}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.selectionGuide")}
          </Text>
          <Text style={styles.guideText}>
            {language === "pl" ? item.pl_selection_guide : item.selection_guide}
          </Text>
        </View>
      )}

      {item.wikipedia_url && (
        <TouchableOpacity
          testID="details-wikipedia"
          style={styles.wikipediaButton}
          onPress={() => {
            Linking.openURL(item.wikipedia_url!);
          }}
        >
          <Ionicons name="earth-outline" size={20} color="#fff" />
          <Text style={styles.wikipediaButtonText}>
            {i18n.t("details.wikipedia")}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { alignItems: "center", padding: 20, paddingBottom: 40 },
  name: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  iconSlot: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
  },
  iconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  iconImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 12,
  },
  emptyIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 4,
    borderColor: "#6b1d52",
  },
  emoji: {
    fontSize: 60,
  },
  resetIconButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    zIndex: 30,
  },
  guideSection: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b1d52",
    marginBottom: 10,
  },
  guideText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  monthsSection: {
    width: "100%",
    marginTop: 15,
    alignItems: "center",
  },
  monthsLabel: {
    fontSize: 14,
    color: "#333",
  },
  bestMonthsLabel: {
    fontSize: 14,
    color: "#6b1d52",
    marginTop: 4,
  },
  rarityImageRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  rarityCircle: {
    width: "33.3%",
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  rarityCircleEmoji: {
    fontSize: 40,
  },
  iconContainerInRow: {
    width: "33.3%",
    alignItems: "center",
    justifyContent: "center",
  },
  rarityTextContainer: {
    width: "33.3%",
    alignItems: "center",
    justifyContent: "center",
  },
  rarityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  setImageButton: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
    zIndex: 20,
  },
  wikipediaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6b1d52",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  wikipediaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProduceDetailsScreen;
