import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Produce, Recipe, RegionCode } from "../types";
import type { NutritionBasis } from "../constants/nutrition";
import { formatMonths } from "../utils/utils";
import { NUTRIENT_INFO } from "../constants/nutrition";
import type { NutrientKey } from "../constants/nutrition";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getAvailableLanguages,
  getAvailableRegionLanguages,
  i18n,
} from "../services/i18n";
import { DEFAULT_REGION, getSeasonality } from "../services/produceSeasonality";
import { FONTS, themeColors } from "../constants/theme";
import { getRarityInfo } from "../constants/produce";
import { CONTACT_URL } from "../constants/links";
import {
  addCustomRecipe,
  deleteCustomRecipe,
  getCustomRecipes,
  hasReadFunFact,
  getProduceNote,
  saveProduceNote,
  setFunFactReadStatus,
  updateCustomRecipe,
} from "../services/storage";
import {
  AppText as Text,
  AppTextInput as TextInput,
} from "../components/Typography";
import type { RootStackParamList } from "../navigation/types";

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Details"
>;

type Props = {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
};

const ICON_SIZE = 204;
const ICON_FRAME_SIZE = 224;
const ICON_AURA_SIZE = ICON_SIZE * 1.75;
const PRODUCE_LOGO = require("../../assets/beet_mini.png");

const NUTRIENT_GROUPS: {
  id: "energy" | "macros" | "vitamins" | "minerals";
  nutrients: NutrientKey[];
  color: string;
}[] = [
  {
    id: "energy",
    nutrients: ["energy"],
    color: themeColors.semantic.uncommon[100],
  },
  {
    id: "macros",
    nutrients: ["fiber", "carbohydrates", "protein", "fat"],
    color: themeColors.semantic.epic[100],
  },
  {
    id: "vitamins",
    nutrients: ["vitaminA", "vitaminB1", "vitaminB6", "vitaminC", "vitaminK", "folate"],
    color: themeColors.semantic.legendary[100],
  },
  {
    id: "minerals",
    nutrients: [
      "calcium",
      "copper",
      "iron",
      "magnesium",
      "manganese",
      "phosphorus",
      "potassium",
      "selenium",
    ],
    color: themeColors.semantic.rare[100],
  },
];

const NUTRITION_SERVING_TRANSLATION_KEYS: Record<NutritionBasis, string> = {
  raw: "details.nutritionServing",
  rawEdiblePortion: "details.nutritionServingRawEdiblePortion",
  freshEdiblePortion: "details.nutritionServingFreshEdiblePortion",
  rawBeetLeaves: "details.nutritionServingRawBeetLeaves",
  rawSorrel: "details.nutritionServingRawSorrel",
  rawRoseHips: "details.nutritionServingRawRoseHips",
};

const ProduceDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { language, setLanguage } = useLanguage();
  const {
    item,
    iconUri: initialIconUri,
    region = DEFAULT_REGION,
    onPickImage,
    onResetIcon,
  } = route.params;
  const availableRegionLanguages = getAvailableRegionLanguages(region);
  const availableAppLanguages = getAvailableLanguages().map(
    ({ value }) => value,
  );
  const otherRegionLanguage = availableRegionLanguages
    .filter((availableLanguage) => availableLanguage !== "en")
    .sort()
    .find((availableLanguage) =>
      availableAppLanguages.includes(availableLanguage),
    );
  const translationLanguage =
    language === "en"
      ? otherRegionLanguage
      : availableRegionLanguages.includes("en")
        ? "en"
        : undefined;
  const seasonality = getSeasonality(item, region);
  const nutritionItems = item.nutritionItems ?? [];
  const nutrientLanguage = language === "pl" ? "pl" : "en";
  const nutritionServing = i18n.t(
    NUTRITION_SERVING_TRANSLATION_KEYS[item.nutritionBasis ?? "raw"],
    language,
  );
  const nutritionUnavailable = i18n.t(
    "details.nutritionUnavailable",
    language,
  );
  const nutritionProductNote = item.nutritionNoteKey
    ? i18n.t(
        `details.nutritionProductNote.${item.nutritionNoteKey}`,
        language,
      )
    : undefined;
  const hasNutritionData = nutritionItems.length > 0;
  const hasNutritionCard = hasNutritionData || item.nutritionItems !== undefined;
  const nutritionNote = i18n.t("details.nutritionNote", language);
  const selectionGuide = i18n.tOptional(
    `produce.${item.id}.selectionGuide`,
    language,
    region,
  );
  const storageGuide = i18n.tOptional(
    `produce.${item.id}.storageGuide`,
    language,
    region,
  );
  const defaultRecipeEntries = (item.defaultRecipeIds ?? []).flatMap(
    (recipeId) => {
      const name = i18n.tOptional(
        `produce.${item.id}.recipes.${recipeId}.name`,
        language,
        region,
      );
      const instructions = i18n.tOptional(
        `produce.${item.id}.recipes.${recipeId}.instructions`,
        language,
        region,
      );
      const raw = i18n.tOptional(
        `produce.${item.id}.recipes.${recipeId}.raw`,
        language,
        region,
      );
      return name && instructions
        ? [{ id: recipeId, name, instructions, raw }]
        : [];
    },
  );
  const funFact = i18n.tOptional(
    `produce.${item.id}.funFact`,
    language,
    region,
  );
  const defaultRecipes = defaultRecipeEntries.map(
    ({ id, name, instructions, raw }) => ({ id, name, instructions, raw }),
  );
  const rarityInfo = getRarityInfo(item.rarity);

  useEffect(() => {
    navigation.setOptions({
      title:
        i18n.tOptional(`produce.${item.id}.name`, language, region) ?? item.id,
    });
  }, [navigation, language, item.id]);
  const isFocused = useIsFocused();

  const [iconUri, setIconUri] = useState<string | undefined>(initialIconUri);
  const [hasReadFact, setHasReadFact] = useState<boolean | null>(null);
  const [showFunFact, setShowFunFact] = useState(false);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [produceNote, setProduceNote] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showDeleteNoteConfirmation, setShowDeleteNoteConfirmation] =
    useState(false);
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientKey | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isDeletingNote, setIsDeletingNote] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);
  const factReadRef = useRef(false);
  const factReadStatusChangedRef = useRef(false);
  const factReadSaveQueueRef = useRef(Promise.resolve());
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // when screen is focused we might want to sync any changes that happened elsewhere
  useEffect(() => {
    if (isFocused) {
      setIconUri(initialIconUri);
    }
  }, [isFocused, initialIconUri]);

  useEffect(() => {
    let isActive = true;
    factReadRef.current = false;
    factReadStatusChangedRef.current = false;
    setHasReadFact(null);

    const loadReadStatus = async () => {
      try {
        const hasRead = await hasReadFunFact(item.id);
        if (isActive && !factReadStatusChangedRef.current) {
          factReadRef.current = hasRead;
          setHasReadFact(hasRead);
        }
      } catch (error) {
        if (!isActive) return;
        console.warn("Failed to load fun fact read status", error);
        Alert.alert(
          i18n.t("settings.errorTitle", language),
          i18n.t("settings.errorMessage", language),
        );
      }
    };

    void loadReadStatus();
    return () => {
      isActive = false;
    };
  }, [item.id, language]);

  useEffect(() => {
    if (!funFact || hasReadFact !== false) {
      shakeAnimation.stopAnimation();
      shakeAnimation.setValue(0);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    const randomBetween = (minimum: number, maximum: number) =>
      minimum + Math.random() * (maximum - minimum);

    const shake = () => {
      shakeAnimation.setValue(0);
      let direction = Math.random() < 0.5 ? -1 : 1;
      const swingCount = 4 + Math.floor(Math.random() * 3);
      const swings: Animated.CompositeAnimation[] = [];

      for (let index = 0; index < swingCount; index += 1) {
        const decay = 1 - index * 0.12;
        const strength = randomBetween(0.72, 1) * decay;
        swings.push(
          Animated.timing(shakeAnimation, {
            toValue: direction * strength,
            duration: randomBetween(75, 145),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        );
        direction *= -1;
      }

      swings.push(
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: randomBetween(90, 150),
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      );

      Animated.sequence(swings).start(({ finished }) => {
        if (finished) {
          timeout = setTimeout(shake, randomBetween(650, 1450));
        }
      });
    };

    timeout = setTimeout(shake, randomBetween(350, 950));
    return () => {
      clearTimeout(timeout);
      shakeAnimation.stopAnimation();
      shakeAnimation.setValue(0);
    };
  }, [funFact, hasReadFact, shakeAnimation]);

  useEffect(() => {
    if (!isFocused) return;

    let isActive = true;
    setCustomRecipes([]);
    setProduceNote(null);
    const loadLocalDetails = async () => {
      try {
        const [recipes, note] = await Promise.all([
          getCustomRecipes(item.id),
          getProduceNote(item.id),
        ]);
        if (isActive) {
          setCustomRecipes(recipes);
          setProduceNote(note);
        }
      } catch (error) {
        if (!isActive) return;
        console.warn("Failed to load local produce details", error);
        Alert.alert(
          i18n.t("settings.errorTitle", language),
          i18n.t("settings.errorMessage", language),
        );
      }
    };

    void loadLocalDetails();
    return () => {
      isActive = false;
    };
  }, [isFocused, item.id, language]);

  const openProduceNoteForm = () => {
    setNoteDraft(produceNote ?? "");
    setShowNoteForm(true);
  };

  const handleSaveProduceNote = async () => {
    if (isSavingNote) return;
    setIsSavingNote(true);
    try {
      const savedNote = noteDraft.trim() || null;
      await saveProduceNote(item.id, savedNote);
      setProduceNote(savedNote);
      setShowNoteForm(false);
    } catch (error) {
      console.warn("Failed to save produce note", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("settings.errorMessage", language),
      );
    } finally {
      setIsSavingNote(false);
    }
  };

  const confirmDeleteProduceNote = () => {
    setShowDeleteNoteConfirmation(true);
  };

  const handleDeleteProduceNote = async () => {
    if (isDeletingNote) return;

    setIsDeletingNote(true);
    try {
      await saveProduceNote(item.id, null);
      setProduceNote(null);
      setShowDeleteNoteConfirmation(false);
    } catch (error) {
      console.warn("Failed to delete produce note", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("settings.errorMessage", language),
      );
    } finally {
      setIsDeletingNote(false);
    }
  };

  const openNewRecipeForm = () => {
    setRecipeName("");
    setRecipeInstructions("");
    setEditingRecipeId(null);
    setShowRecipeForm(true);
  };

  const openEditRecipeForm = (recipe: Recipe) => {
    setRecipeName(recipe.name);
    setRecipeInstructions(recipe.instructions);
    setEditingRecipeId(recipe.id);
    setShowRecipeForm(true);
  };

  const handleSaveRecipe = async () => {
    if (isSavingRecipe) return;

    const name = recipeName.trim();
    const instructions = recipeInstructions.trim();
    if (!name || !instructions) {
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("details.recipeRequired", language),
      );
      return;
    }

    setIsSavingRecipe(true);
    const existingRecipe = customRecipes.find(
      (entry) => entry.id === editingRecipeId,
    );
    const recipe: Recipe = {
      id:
        editingRecipeId ??
        `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      instructions,
      ...(existingRecipe?.note === undefined
        ? {}
        : { note: existingRecipe.note }),
    };

    try {
      const updatedRecipes = editingRecipeId
        ? await updateCustomRecipe(item.id, recipe)
        : await addCustomRecipe(item.id, recipe);
      setCustomRecipes(updatedRecipes);
      setRecipeName("");
      setRecipeInstructions("");
      setEditingRecipeId(null);
      setShowRecipeForm(false);
    } catch (error) {
      console.warn("Failed to save custom recipe", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("settings.errorMessage", language),
      );
    } finally {
      setIsSavingRecipe(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const updatedRecipes = await deleteCustomRecipe(item.id, recipeId);
      setCustomRecipes(updatedRecipes);
    } catch (error) {
      console.warn("Failed to delete custom recipe", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("settings.errorMessage", language),
      );
    }
  };

  const confirmDeleteRecipe = (recipeId: string) => {
    Alert.alert(
      i18n.t("details.deleteRecipe", language),
      i18n.t("details.confirmDeleteRecipe", language),
      [
        { text: i18n.t("details.cancel", language), style: "cancel" },
        {
          text: i18n.t("details.deleteRecipe", language),
          style: "destructive",
          onPress: () => void handleDeleteRecipe(recipeId),
        },
      ],
    );
  };

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

  const saveFunFactReadStatus = (isRead: boolean) => {
    factReadRef.current = isRead;
    factReadStatusChangedRef.current = true;
    setHasReadFact(isRead);
    factReadSaveQueueRef.current = factReadSaveQueueRef.current
      .catch(() => undefined)
      .then(() => setFunFactReadStatus(item.id, isRead))
      .catch((error: unknown) => {
        console.warn("Failed to save fun fact read status", error);
        Alert.alert(
          i18n.t("settings.errorTitle", language),
          i18n.t("settings.errorMessage", language),
        );
      });
  };

  const handleOpenFunFact = () => {
    setShowFunFact(true);
    if (!factReadRef.current) saveFunFactReadStatus(true);
  };

  const handleOpenNutrientWikipedia = async () => {
    if (!selectedNutrient) return;

    try {
      await Linking.openURL(NUTRIENT_INFO[selectedNutrient].wikipediaUrl);
    } catch (error) {
      console.warn("Failed to open nutrient Wikipedia page", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("details.nutrientWikipediaError", language),
      );
    }
  };

  const handleReportError = async () => {
    try {
      await Linking.openURL(CONTACT_URL);
    } catch (error) {
      console.warn("Failed to open contact page", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("details.openLinkError", language),
      );
    }
  };

  return (
    <ScrollView
      testID="details-screen"
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.iconHeader}>
        <View style={styles.iconContainerInRow}>
          <View style={styles.produceImageFrame}>
            <View
              testID="details-rarity-glow"
              pointerEvents="none"
              style={[
                styles.rarityGlow,
                { shadowColor: rarityInfo.color },
              ]}
            />
            <Svg
              testID="details-rarity-aura"
              pointerEvents="none"
              width={ICON_AURA_SIZE}
              height={ICON_AURA_SIZE}
              viewBox="0 0 357 357"
              style={styles.rarityAura}
            >
              <Defs>
                <RadialGradient
                  id="detailsRarityAura"
                  cx="50%"
                  cy="50%"
                  rx="50%"
                  ry="50%"
                >
                  <Stop
                    offset="0%"
                    stopColor={rarityInfo.color}
                    stopOpacity={0.38}
                  />
                  <Stop
                    offset="58%"
                    stopColor={rarityInfo.color}
                    stopOpacity={0.2}
                  />
                  <Stop
                    offset="100%"
                    stopColor={rarityInfo.color}
                    stopOpacity={0}
                  />
                </RadialGradient>
              </Defs>
              <Ellipse
                cx="178.5"
                cy="178.5"
                rx="178.5"
                ry="178.5"
                fill="url(#detailsRarityAura)"
              />
            </Svg>
            <View style={styles.iconSlot} testID="details-pick-image">
              {iconUri ? (
                <Image
                  testID="details-produce-image"
                  source={{ uri: iconUri }}
                  style={styles.iconImage}
                />
              ) : (
                <Image
                  testID="details-default-image"
                  source={PRODUCE_LOGO}
                  resizeMode="contain"
                  style={styles.defaultImage}
                />
              )}
            </View>
          </View>
          {funFact && (
            <TouchableOpacity
              accessibilityLabel={i18n.t("details.funFact", language)}
              accessibilityRole="button"
              testID="details-fun-fact-button"
              style={styles.funFactButton}
              onPress={() => void handleOpenFunFact()}
            >
              <Animated.View
                testID="details-fun-fact-icon"
                style={{
                  transform: [
                    {
                      translateX: shakeAnimation.interpolate({
                        inputRange: [-1, 0, 1],
                        outputRange: [-1.5, 0, 1.5],
                      }),
                    },
                    {
                      rotate: shakeAnimation.interpolate({
                        inputRange: [-1, 0, 1],
                        outputRange: ["-15deg", "0deg", "15deg"],
                      }),
                    },
                  ],
                }}
              >
                <Text
                  style={[
                    styles.funFactQuestionMark,
                    {
                      color: themeColors.accent[2],
                    },
                  ]}
                >
                  ?
                </Text>
              </Animated.View>
            </TouchableOpacity>
          )}

          {translationLanguage && (
            <TouchableOpacity
              accessibilityLabel={translationLanguage.toUpperCase()}
              accessibilityRole="button"
              testID="details-language-button"
              style={styles.languageButton}
              onPress={() => void setLanguage(translationLanguage)}
            >
              <Text style={styles.languageButtonText}>
                {translationLanguage.slice(0, 2).toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}

          {!iconUri && onPickImage && (
            <TouchableOpacity
              testID="details-set-image"
              style={styles.imagePickerButton}
              onPress={handlePick}
            >
              <Ionicons
                testID="details-photo-icon"
                name="images-sharp"
                size={22}
                color={themeColors.accent[1]}
              />
            </TouchableOpacity>
          )}

          {iconUri && onResetIcon && (
            <TouchableOpacity
              testID="details-reset-icon"
              onPress={handleReset}
              style={styles.resetIconButton}
            >
              <Ionicons name="close" size={18} color={themeColors.primary[25]} />
            </TouchableOpacity>
          )}
        </View>
        <Text
          testID="details-rarity"
          style={[styles.rarityLabel, { color: rarityInfo.darkColor }]}
        >
          {(language === "pl" ? rarityInfo.plLabel : rarityInfo.label).toUpperCase()}
        </Text>
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

      {selectionGuide && (
        <View testID="details-selection-guide-card" style={styles.guideSection}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.selectionGuide", language)}
          </Text>
          <Text style={styles.guideText}>{selectionGuide}</Text>
        </View>
      )}

      {storageGuide && (
        <View testID="details-storage-guide-card" style={styles.guideSection}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.storageGuide", language)}
          </Text>
          <Text style={styles.guideText}>{storageGuide}</Text>
        </View>
      )}

      {hasNutritionCard && (
        <View testID="details-nutrition-card" style={styles.guideSection}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.nutrition", language)}
          </Text>
          {hasNutritionData ? (
            <>
              <Text style={[styles.guideText, styles.nutritionServing]}>
                {nutritionServing}
              </Text>
              {nutritionProductNote && (
                <Text style={styles.sourceText}>{nutritionProductNote}</Text>
              )}
              {NUTRIENT_GROUPS.map(({ id, nutrients, color }) => {
                const entries = nutrients.flatMap((nutrientKey) =>
                  nutritionItems.filter((entry) => entry.nutrient === nutrientKey),
                );

                if (!entries.length) return null;

                return (
                  <View
                    key={id}
                    testID={`details-nutrition-group-${id}`}
                    style={styles.nutritionGroup}
                  >
                    {entries.map((entry) => {
                      const nutrient = NUTRIENT_INFO[entry.nutrient];
                      const label = nutrient.label[nutrientLanguage];
                      const amount =
                        entry.amount === undefined
                          ? ""
                          : ` ${entry.amount.toLocaleString(
                              language === "pl" ? "pl-PL" : "en-US",
                              { maximumFractionDigits: 1 },
                            )} ${entry.unit ?? ""}`;

                      return (
                        <TouchableOpacity
                          accessibilityRole="button"
                          accessibilityLabel={`${label}${amount}`}
                          key={entry.nutrient}
                          testID={`details-nutrient-${entry.nutrient}`}
                          onPress={() => setSelectedNutrient(entry.nutrient)}
                          style={[
                            styles.nutrientButton,
                            { backgroundColor: color, borderColor: color },
                          ]}
                        >
                          <Text style={styles.nutrientText}>
                            {label}
                            {amount}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </>
          ) : (
            <Text style={styles.guideText}>{nutritionUnavailable}</Text>
          )}
          {nutritionNote && (
            <Text style={styles.sourceText}>
              {nutritionNote}
            </Text>
          )}
        </View>
      )}

      <View testID="details-recipes-card" style={styles.guideSection}>
        <Text style={styles.guideTitle}>
          {i18n.t("details.recipes", language)}
        </Text>
        {[...defaultRecipes, ...customRecipes].map((recipe) => {
          const isCustomRecipe = customRecipes.some(
            (customRecipe) => customRecipe.id === recipe.id,
          );
          const recipeName =
            language === "pl" &&
            "plName" in recipe &&
            typeof recipe.plName === "string"
              ? recipe.plName
              : recipe.name;
          const recipeInstructions =
            language === "pl" &&
            "plInstructions" in recipe &&
            typeof recipe.plInstructions === "string"
              ? recipe.plInstructions
              : recipe.instructions;

          return (
            <View key={recipe.id} style={styles.recipe}>
              <View style={styles.recipeHeading}>
                <Text style={[styles.recipeTitle, styles.recipeTitleFlex]}>
                  {recipeName}
                </Text>
                {isCustomRecipe && (
                  <View style={styles.recipeActions}>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={i18n.t("details.editRecipe", language)}
                      testID={`recipe-edit-${recipe.id}`}
                      onPress={() => openEditRecipeForm(recipe)}
                      style={styles.recipeActionButton}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color={themeColors.primary[25]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={i18n.t(
                        "details.deleteRecipe",
                        language,
                      )}
                      testID={`recipe-delete-${recipe.id}`}
                      onPress={() => confirmDeleteRecipe(recipe.id)}
                      style={styles.recipeActionButton}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={themeColors.primary[25]}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text style={styles.guideText}>
                {recipeInstructions}
              </Text>
              {recipe.raw && (
                <>
                  <Text
                    style={styles.recipeTitle}
                    testID={`recipe-raw-title-${recipe.id}`}
                  >
                    {i18n.t("details.raw", language)}
                  </Text>
                  <Text
                    style={styles.guideText}
                    testID={`recipe-raw-${recipe.id}`}
                  >
                    {recipe.raw}
                  </Text>
                </>
              )}
            </View>
          );
        })}
        <TouchableOpacity
          accessibilityRole="button"
          testID="details-add-recipe"
          style={styles.addRecipeButton}
          onPress={openNewRecipeForm}
        >
          <Ionicons name="add-circle-outline" size={22} color={themeColors.primary[25]} />
          <Text style={styles.addRecipeText}>
            {i18n.t("details.addRecipe", language)}
          </Text>
        </TouchableOpacity>
      </View>

      {produceNote ? (
        <View testID="details-produce-note-card" style={styles.guideSection}>
          <View style={styles.produceNoteHeading}>
            <Text style={styles.guideTitle}>
              {i18n.t("details.produceNote", language)}
            </Text>
            <View style={styles.recipeActions}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={i18n.t("details.editProduceNote", language)}
                testID="details-edit-produce-note"
                onPress={openProduceNoteForm}
                style={styles.recipeActionButton}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={themeColors.primary[25]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={i18n.t("details.deleteProduceNote", language)}
                testID="details-delete-produce-note"
                onPress={confirmDeleteProduceNote}
                style={styles.recipeActionButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={themeColors.primary[25]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text testID="details-produce-note" style={styles.guideText}>
            {produceNote}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          testID="details-add-produce-note"
          onPress={openProduceNoteForm}
          style={styles.addRecipeButton}
        >
          <Ionicons
            name="add-circle-outline"
            size={22}
            color={themeColors.primary[25]}
          />
          <Text style={styles.addRecipeText}>
            {i18n.t("details.addProduceNote", language)}
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showFunFact}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFunFact(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            accessibilityViewIsModal
            style={styles.recipeModal}
            testID="details-fun-fact-modal"
          >
            <Text accessibilityRole="header" style={styles.modalTitle}>
              {i18n.t("details.funFact", language)}
            </Text>
            <Text style={styles.guideText}>{funFact}</Text>
            <TouchableOpacity
              accessibilityRole="checkbox"
              accessibilityState={{ checked: hasReadFact === true }}
              testID="details-fun-fact-read-checkbox"
              style={styles.funFactReadCheckbox}
              onPress={() => saveFunFactReadStatus(!factReadRef.current)}
            >
              <Ionicons
                name={
                  hasReadFact
                    ? "checkbox"
                    : "square-outline"
                }
                size={22}
                color={themeColors.primary[25]}
              />
              <Text style={styles.funFactReadLabel}>
                {i18n.t("details.funFactRead", language)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              testID="details-fun-fact-close"
              style={styles.modalCloseButton}
              onPress={() => setShowFunFact(false)}
            >
              <Text style={styles.modalCloseButtonText}>
                {i18n.t("details.close", language)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRecipeForm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRecipeForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recipeModal}>
            <Text style={styles.modalTitle}>
              {i18n.t(
                editingRecipeId ? "details.editRecipe" : "details.addRecipe",
                language,
              )}
            </Text>
            <TextInput
              accessibilityLabel={i18n.t("details.recipeName", language)}
              testID="recipe-name-input"
              onChangeText={setRecipeName}
              placeholder={i18n.t("details.recipeNamePlaceholder", language)}
              style={styles.recipeInput}
              value={recipeName}
            />
            <TextInput
              accessibilityLabel={i18n.t("details.recipeInstructions", language)}
              testID="recipe-instructions-input"
              multiline
              onChangeText={setRecipeInstructions}
              placeholder={i18n.t(
                "details.recipeInstructionsPlaceholder",
                language,
              )}
              style={[styles.recipeInput, styles.recipeInstructionsInput]}
              textAlignVertical="top"
              value={recipeInstructions}
            />
            <TouchableOpacity
              accessibilityRole="button"
              testID="recipe-save"
              disabled={isSavingRecipe}
              style={styles.saveRecipeButton}
              onPress={() => void handleSaveRecipe()}
            >
              <Text style={styles.saveRecipeButtonText}>
                {i18n.t(
                  editingRecipeId
                    ? "details.saveRecipeChanges"
                    : "details.saveRecipe",
                  language,
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowRecipeForm(false)}
            >
              <Text style={styles.modalCloseButtonText}>
                {i18n.t("details.cancel", language)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNoteForm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNoteForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recipeModal}>
            <Text style={styles.modalTitle}>
              {i18n.t(
                produceNote
                  ? "details.editProduceNote"
                  : "details.addProduceNote",
                language,
              )}
            </Text>
            <TextInput
              accessibilityLabel={i18n.t("details.produceNote", language)}
              testID="details-produce-note-input"
              multiline
              onChangeText={setNoteDraft}
              placeholder={i18n.t(
                "details.produceNotePlaceholder",
                language,
              )}
              style={[styles.recipeInput, styles.produceNoteInput]}
              textAlignVertical="top"
              value={noteDraft}
            />
            <TouchableOpacity
              accessibilityRole="button"
              testID="details-save-produce-note"
              disabled={isSavingNote}
              style={styles.saveRecipeButton}
              onPress={() => void handleSaveProduceNote()}
            >
              <Text style={styles.saveRecipeButtonText}>
                {i18n.t("details.saveProduceNote", language)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowNoteForm(false)}
            >
              <Text style={styles.modalCloseButtonText}>
                {i18n.t("details.cancel", language)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteNoteConfirmation}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteNoteConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recipeModal}>
            <Text style={styles.modalTitle}>
              {i18n.t("details.confirmDeleteProduceNote", language)}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              testID="details-confirm-delete-produce-note"
              disabled={isDeletingNote}
              style={styles.saveRecipeButton}
              onPress={() => void handleDeleteProduceNote()}
            >
              <Text style={styles.saveRecipeButtonText}>
                {i18n.t("details.confirmReset", language)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="details-cancel-delete-produce-note"
              disabled={isDeletingNote}
              style={styles.modalCloseButton}
              onPress={() => setShowDeleteNoteConfirmation(false)}
            >
              <Text style={styles.modalCloseButtonText}>
                {i18n.t("details.cancel", language)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={selectedNutrient !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNutrient(null)}
      >
        <View style={styles.modalOverlay}>
          {selectedNutrient && (
            <View
              accessibilityViewIsModal
              style={styles.nutrientModal}
              testID="details-nutrient-modal"
            >
              <Text accessibilityRole="header" style={styles.modalTitle}>
                {NUTRIENT_INFO[selectedNutrient].label[nutrientLanguage]}
              </Text>
              <Text style={styles.guideText}>
                {
                  NUTRIENT_INFO[selectedNutrient].description[
                    nutrientLanguage
                  ]
                }
              </Text>
              <TouchableOpacity
                accessibilityRole="link"
                testID="details-nutrient-wikipedia"
                style={styles.nutrientWikipediaButton}
                onPress={() => void handleOpenNutrientWikipedia()}
              >
                <Ionicons
                  name="open-outline"
                  size={18}
                  color={themeColors.primary[25]}
                />
                <Text style={styles.nutrientWikipediaText}>
                  {i18n.t("details.nutrientWikipedia", language)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                testID="details-nutrient-close"
                style={styles.modalCloseButton}
                onPress={() => setSelectedNutrient(null)}
              >
                <Text style={styles.modalCloseButtonText}>
                  {i18n.t("details.close", language)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      <View style={styles.linkButtonsRow}>
        {item.wikipediaUrl && (
          <TouchableOpacity
            testID="details-wikipedia"
            style={styles.linkButton}
            onPress={handleOpenWikipedia}
          >
            <Text style={styles.linkButtonText}>
              {i18n.t("details.wikipedia", language)}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          testID="details-report-error"
          style={styles.linkButton}
          onPress={() => void handleReportError()}
        >
          <Text style={styles.linkButtonText}>
            {i18n.t("details.reportError", language)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themeColors.neutral.lightGrey },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 100,
  },
  iconImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: themeColors.neutral.white,
  },
  produceImageFrame: {
    width: ICON_FRAME_SIZE,
    height: ICON_FRAME_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  rarityGlow: {
    position: "absolute",
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 48,
    elevation: 18,
  },
  rarityAura: {
    position: "absolute",
    width: ICON_AURA_SIZE,
    height: ICON_AURA_SIZE,
    top: (ICON_FRAME_SIZE - ICON_AURA_SIZE) / 2,
    left: (ICON_FRAME_SIZE - ICON_AURA_SIZE) / 2,
  },
  defaultImage: {
    width: 132,
    height: 132,
    zIndex: 1,
  },
  rarityLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 7,
  },
  iconSlot: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeColors.neutral.white,
    overflow: "hidden",
    zIndex: 1,
  },
  resetIconButton: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeColors.neutral.white,
    borderWidth: 1,
    borderColor: themeColors.neutral.lightGrey,
    zIndex: 30,
  },
  guideSection: {
    width: "100%",
    backgroundColor: themeColors.neutral.white,
    borderColor: "#D5D1D4",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginTop: 15,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: themeColors.primary[25],
    marginBottom: 5,
  },
  guideText: {
    fontSize: 12,
    color: themeColors.neutral.black,
    lineHeight: 18,
  },
  funFactReadCheckbox: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 16,
    paddingVertical: 4,
  },
  funFactReadLabel: {
    color: themeColors.neutral.black,
    fontSize: 14,
    marginLeft: 8,
  },
  nutritionServing: {
    fontSize: 8,
    lineHeight: 12,
    textTransform: "uppercase",
  },
  nutritionGroup: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    width: "100%",
  },
  nutrientButton: {
    backgroundColor: themeColors.neutral.white,
    borderRadius: 16,
    marginBottom: 4,
    marginRight: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nutrientText: {
    color: themeColors.primary[25],
    fontSize: 12,
  },
  recipe: {
    marginBottom: 8,
  },
  recipeTitle: {
    color: themeColors.neutral.black,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  recipeHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  produceNoteHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recipeTitleFlex: {
    flex: 1,
  },
  recipeActions: {
    flexDirection: "row",
  },
  recipeActionButton: {
    padding: 6,
  },
  addRecipeButton: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
  },
  addRecipeText: {
    color: themeColors.primary[25],
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: `${themeColors.neutral.black}80`,
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  recipeModal: {
    backgroundColor: themeColors.neutral.white,
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  nutrientModal: {
    backgroundColor: themeColors.neutral.white,
    borderRadius: 12,
    maxWidth: 420,
    padding: 20,
    width: "100%",
  },
  nutrientWikipediaButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    marginTop: 18,
    paddingVertical: 8,
  },
  nutrientWikipediaText: {
    color: themeColors.primary[25],
    fontWeight: "600",
    marginLeft: 6,
    textDecorationLine: "underline",
  },
  modalTitle: {
    color: themeColors.neutral.black,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recipeInput: {
    borderColor: themeColors.neutral.lightGrey,
    borderRadius: 6,
    borderWidth: 1,
    color: themeColors.neutral.black,
    marginBottom: 12,
    padding: 12,
  },
  recipeInstructionsInput: {
    minHeight: 120,
  },
  produceNoteInput: {
    minHeight: 140,
  },
  saveRecipeButton: {
    alignItems: "center",
    backgroundColor: themeColors.primary.main,
    borderRadius: 8,
    padding: 12,
  },
  saveRecipeButtonText: {
    color: themeColors.neutral.white,
    fontWeight: "bold",
  },
  modalCloseButton: {
    alignItems: "center",
    marginTop: 12,
    padding: 10,
  },
  modalCloseButtonText: {
    color: themeColors.neutral.black,
    fontWeight: "600",
  },
  sourceText: {
    fontSize: 10,
    color: themeColors.neutral.darkGrey,
    lineHeight: 13,
    marginTop: 4,
  },
  monthsSection: {
    width: "100%",
    marginTop: 15,
    alignItems: "center",
  },
  monthsLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: themeColors.neutral.black,
  },
  bestMonthsLabel: {
    fontSize: 10,
    color: themeColors.neutral.darkGrey,
    marginTop: 4,
  },
  iconHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainerInRow: {
    position: "relative",
    width: ICON_FRAME_SIZE,
    height: ICON_FRAME_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerButton: {
    position: "absolute",
    right: 3,
    bottom: 3,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: themeColors.neutral.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: themeColors.neutral.lightGrey,
    zIndex: 20,
  },
  languageButton: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: themeColors.neutral.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: themeColors.neutral.lightGrey,
    zIndex: 20,
  },
  languageButtonText: {
    color: themeColors.accent[2],
    fontSize: 12,
    fontFamily: FONTS.navigationBold,
    fontWeight: "900",
  },
  funFactButton: {
    position: "absolute",
    left: 3,
    bottom: 3,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: themeColors.neutral.white,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  funFactQuestionMark: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34,
  },
  linkButtonsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  linkButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeColors.primary.main,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  linkButtonText: {
    color: themeColors.neutral.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProduceDetailsScreen;
