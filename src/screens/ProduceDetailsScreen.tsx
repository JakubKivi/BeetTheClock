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
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Produce, Recipe, RegionCode } from "../types";
import { formatMonths } from "../utils/utils";
import { getRarityInfo } from "../constants/produce";
import { useLanguage } from "../contexts/LanguageContext";
import { i18n } from "../services/i18n";
import { DEFAULT_REGION, getSeasonality } from "../services/produceSeasonality";
import { COLORS } from "../constants/theme";
import { CONTACT_URL } from "../constants/links";
import {
  addCustomRecipe,
  deleteCustomRecipe,
  getCustomRecipes,
  getProduceNote,
  saveProduceNote,
  updateCustomRecipe,
} from "../services/storage";

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
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [produceNote, setProduceNote] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [recipeNote, setRecipeNote] = useState("");
  const [showRecipeNoteInput, setShowRecipeNoteInput] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);

  // when screen is focused we might want to sync any changes that happened elsewhere
  useEffect(() => {
    if (isFocused) {
      setIconUri(initialIconUri);
    }
  }, [isFocused, initialIconUri]);

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
    Alert.alert(
      i18n.t("details.deleteProduceNote", language),
      i18n.t("details.confirmDeleteProduceNote", language),
      [
        { text: i18n.t("details.cancel", language), style: "cancel" },
        {
          text: i18n.t("details.deleteProduceNote", language),
          style: "destructive",
          onPress: () => {
            void (async () => {
              try {
                await saveProduceNote(item.id, null);
                setProduceNote(null);
              } catch (error) {
                console.warn("Failed to delete produce note", error);
                Alert.alert(
                  i18n.t("settings.errorTitle", language),
                  i18n.t("settings.errorMessage", language),
                );
              }
            })();
          },
        },
      ],
    );
  };

  const openNewRecipeForm = () => {
    setRecipeName("");
    setRecipeInstructions("");
    setRecipeNote("");
    setShowRecipeNoteInput(false);
    setEditingRecipeId(null);
    setShowRecipeForm(true);
  };

  const openEditRecipeForm = (recipe: Recipe) => {
    setRecipeName(recipe.name);
    setRecipeInstructions(recipe.instructions);
    setRecipeNote(recipe.note ?? "");
    setShowRecipeNoteInput(Boolean(recipe.note));
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
    const recipe: Recipe = {
      id:
        editingRecipeId ??
        `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      instructions,
      ...(showRecipeNoteInput && recipeNote.trim()
        ? { note: recipeNote.trim() }
        : {}),
    };

    try {
      const updatedRecipes = editingRecipeId
        ? await updateCustomRecipe(item.id, recipe)
        : await addCustomRecipe(item.id, recipe);
      setCustomRecipes(updatedRecipes);
      setRecipeName("");
      setRecipeInstructions("");
      setRecipeNote("");
      setShowRecipeNoteInput(false);
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
          <Text style={styles.guideText}>
            {language === "pl"
              ? item.plNutritionalInfo ?? item.nutritionalInfo
              : item.nutritionalInfo}
          </Text>
          <Text style={styles.sourceText}>
            {i18n.t("details.nutritionSource", language)}
          </Text>
          {item.nutritionNote && (
            <Text style={styles.sourceText}>
              {language === "pl"
                ? item.nutritionNote.pl
                : item.nutritionNote.en}
            </Text>
          )}
        </View>
      )}

      <View style={styles.guideSection}>
        <Text style={styles.guideTitle}>
          {i18n.t("details.recipes", language)}
        </Text>
        {[...(item.recipes ?? []), ...customRecipes].map((recipe) => {
          const isCustomRecipe = customRecipes.some(
            (customRecipe) => customRecipe.id === recipe.id,
          );
          return (
            <View key={recipe.id} style={styles.recipe}>
              <View style={styles.recipeHeading}>
                <Text style={[styles.recipeTitle, styles.recipeTitleFlex]}>
                  {language === "pl" ? recipe.plName ?? recipe.name : recipe.name}
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
                        color={COLORS.primary}
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
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text style={styles.guideText}>
                {language === "pl"
                  ? recipe.plInstructions ?? recipe.instructions
                  : recipe.instructions}
              </Text>
              {recipe.note ? (
                <Text testID={`recipe-note-${recipe.id}`} style={styles.recipeNote}>
                  {i18n.t("details.recipeNote", language)}: {recipe.note}
                </Text>
              ) : null}
            </View>
          );
        })}
        <TouchableOpacity
          accessibilityRole="button"
          testID="details-add-recipe"
          style={styles.addRecipeButton}
          onPress={openNewRecipeForm}
        >
          <Ionicons name="add-circle-outline" size={22} color={COLORS.primary} />
          <Text style={styles.addRecipeText}>
            {i18n.t("details.addRecipe", language)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.guideSection}>
        <View style={styles.produceNoteHeading}>
          <Text style={styles.guideTitle}>
            {i18n.t("details.produceNote", language)}
          </Text>
          {produceNote ? (
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
                  color={COLORS.primary}
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
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {produceNote ? (
          <Text testID="details-produce-note" style={styles.guideText}>
            {produceNote}
          </Text>
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
              color={COLORS.primary}
            />
            <Text style={styles.addRecipeText}>
              {i18n.t("details.addProduceNote", language)}
            </Text>
          </TouchableOpacity>
        )}
      </View>

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
            {showRecipeNoteInput ? (
              <>
                <TextInput
                  accessibilityLabel={i18n.t("details.recipeNote", language)}
                  testID="recipe-note-input"
                  multiline
                  onChangeText={setRecipeNote}
                  placeholder={i18n.t(
                    "details.recipeNotePlaceholder",
                    language,
                  )}
                  style={[styles.recipeInput, styles.recipeNoteInput]}
                  textAlignVertical="top"
                  value={recipeNote}
                />
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => {
                    setRecipeNote("");
                    setShowRecipeNoteInput(false);
                  }}
                  style={styles.noteToggleButton}
                >
                  <Text style={styles.noteToggleText}>
                    {i18n.t("details.removeRecipeNote", language)}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                accessibilityRole="button"
                testID="recipe-add-note"
                onPress={() => setShowRecipeNoteInput(true)}
                style={styles.noteToggleButton}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.noteToggleText}>
                  {i18n.t("details.addRecipeNote", language)}
                </Text>
              </TouchableOpacity>
            )}
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

      <View style={styles.linkButtonsRow}>
        {item.wikipediaUrl && (
          <TouchableOpacity
            testID="details-wikipedia"
            style={styles.linkButton}
            onPress={handleOpenWikipedia}
          >
            <Ionicons name="earth-outline" size={20} color={COLORS.white} />
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
          <Ionicons name="alert-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.linkButtonText}>
            {i18n.t("details.reportError", language)}
          </Text>
        </TouchableOpacity>
      </View>
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
  recipe: {
    marginBottom: 12,
  },
  recipeTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
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
  recipeNote: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 18,
    marginTop: 6,
  },
  addRecipeButton: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
  },
  addRecipeText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  recipeModal: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recipeInput: {
    borderColor: COLORS.inputBorder,
    borderRadius: 6,
    borderWidth: 1,
    color: COLORS.text,
    marginBottom: 12,
    padding: 12,
  },
  recipeInstructionsInput: {
    minHeight: 120,
  },
  recipeNoteInput: {
    minHeight: 72,
    marginBottom: 4,
  },
  produceNoteInput: {
    minHeight: 140,
  },
  noteToggleButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    marginBottom: 12,
    paddingVertical: 6,
  },
  noteToggleText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
  saveRecipeButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
  },
  saveRecipeButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  modalCloseButton: {
    alignItems: "center",
    marginTop: 12,
    padding: 10,
  },
  modalCloseButtonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  sourceText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 8,
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
  linkButtonsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  linkButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  linkButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProduceDetailsScreen;
