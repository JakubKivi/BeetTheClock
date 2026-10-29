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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Produce, RegionCode } from "../types";
import { formatMonths } from "../utils/utils";
import { getRarityInfo } from "../constants/produce";
import { useLanguage } from "../contexts/LanguageContext";
import { i18n } from "../services/i18n";
import { DEFAULT_REGION, getSeasonality } from "../services/produceSeasonality";
import { COLORS } from "../constants/theme";

// define the types for route params
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Details: {
    item: Produce;
    iconUri?: string;
    region?: RegionCode;
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

type DetailsScreenNavigationProp = NativeStackNavigationProp<
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
    region = DEFAULT_REGION,
    onPickImage,
    onResetIcon,
  } = route.params;
  const seasonality = getSeasonality(item, region);

  useEffect(() => {
    navigation.setOptions({
      title: language === "pl" ? item.plName : item.name,
    });
  }, [navigation, language, item.plName, item.name]);
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

  const handleOpenWikipedia = () => {
    if (item.wikipediaUrl) {
      void Linking.openURL(item.wikipediaUrl);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.rarityImageRow}>
        {/* Rarity Circle */}
        <View style={styles.rarityCircle}>
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
              <Ionicons name="image-outline" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          )}

          {iconUri && onResetIcon && (
            <TouchableOpacity
              testID="details-reset-icon"
              onPress={handleReset}
              style={styles.resetIconButton}
            >
              <Ionicons name="close" size={18} color={COLORS.primary} />
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
              ? getRarityInfo(item.rarity).plLabel
              : getRarityInfo(item.rarity).label}
          </Text>
        </View>
      </View>

      {/* availability months and best months */}
      {seasonality?.months.length ? (
        <View style={styles.monthsSection}>
          <Text style={styles.monthsLabel}>
            {formatMonths(seasonality.months, language)}
          </Text>
          {seasonality.bestMonths?.length ? (
            <Text style={styles.bestMonthsLabel}>
              {i18n.t("details.best", language)}:{" "}
              {formatMonths(seasonality.bestMonths, language)}
            </Text>
          ) : null}
        </View>
      ) : null}

      {(language === "pl" ? item.plSelectionGuide : item.selectionGuide) && (
        <View style={styles.guideSection}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.selectionGuide")}
          </Text>
          <Text style={styles.guideText}>
            {language === "pl" ? item.plSelectionGuide : item.selectionGuide}
          </Text>
        </View>
      )}

      {(language === "pl" ? item.plStorageGuide : item.storageGuide) && (
        <View style={styles.guideSection}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.storageGuide")}
          </Text>
          <Text style={styles.guideText}>
            {language === "pl" ? item.plStorageGuide : item.storageGuide}
          </Text>
        </View>
      )}

      {item.nutritionalInfo && (
        <View style={styles.guideSection}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.nutrition", language)}
          </Text>
          <Text style={styles.guideText}>{item.nutritionalInfo}</Text>
        </View>
      )}

      {item.recipes?.length ? (
        <View style={styles.guideSection}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.recipes", language)}
          </Text>
          {item.recipes.map((recipe, index) => (
            <Text key={`${recipe}-${index}`} style={styles.guideText}>
              {recipe}
            </Text>
          ))}
        </View>
      ) : null}

      {item.wikipediaUrl && (
        <TouchableOpacity
          testID="details-wikipedia"
          style={styles.wikipediaButton}
          onPress={handleOpenWikipedia}
        >
          <Ionicons name="earth-outline" size={20} color={COLORS.white} />
          <Text style={styles.wikipediaButtonText}>
            {i18n.t("details.wikipedia")}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { alignItems: "center", padding: 20, paddingBottom: 40 },
  name: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  iconSlot: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
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
    borderColor: COLORS.primary,
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
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 30,
  },
  guideSection: {
    width: "100%",
    backgroundColor: COLORS.mutedSurface,
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  guideText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  monthsSection: {
    width: "100%",
    marginTop: 15,
    alignItems: "center",
  },
  monthsLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  bestMonthsLabel: {
    fontSize: 14,
    color: COLORS.primary,
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
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 20,
  },
  wikipediaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  wikipediaButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProduceDetailsScreen;
