import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { themeColors } from "../constants/theme";
import {
  RegionCode,
  NotificationFrequency,
  NotificationWeekday,
} from "../types";
import { getAvailableLanguages, i18n } from "../services/i18n";
import { DEFAULT_REGION } from "../constants/regions";
import {
  AppSettings,
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
} from "../services/storage";
import {
  isValidNotificationTime,
  syncScheduledNotifications,
} from "../services/notifications";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppData } from "../contexts/DataContext";
import { CONTACT_URL, DATA_FILES_URL } from "../constants/links";
import {
  AppText as Text,
  AppTextInput as TextInput,
} from "../components/Typography";

const FREQUENCY_OPTIONS: {
  label: string;
  value: NotificationFrequency;
}[] = [
  { label: "settings.frequencyMonthly", value: "monthly" },
  { label: "settings.frequencyWeekly", value: "weekly" },
  { label: "settings.frequencyDaily", value: "daily" },
];

const WEEKDAY_OPTIONS: { label: string; value: NotificationWeekday }[] = [
  { label: "settings.weekdayMonday", value: 1 },
  { label: "settings.weekdayTuesday", value: 2 },
  { label: "settings.weekdayWednesday", value: 3 },
  { label: "settings.weekdayThursday", value: 4 },
  { label: "settings.weekdayFriday", value: 5 },
  { label: "settings.weekdaySaturday", value: 6 },
  { label: "settings.weekdaySunday", value: 7 },
];

const SettingsScreen = () => {
  const { language, setLanguage } = useLanguage();
  const {
    languages,
    regions,
    activeRegion,
    setActiveRegion,
    importFiles,
  } = useAppData();
  const languageOptions = getAvailableLanguages().filter(({ value }) =>
    languages.includes(value),
  );
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const settingsRef = useRef<AppSettings>(DEFAULT_SETTINGS);
  const persistedSettingsRef = useRef<AppSettings>(DEFAULT_SETTINGS);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>(
    activeRegion,
  );
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [importInfoTarget, setImportInfoTarget] = useState<
    "app-locale" | "region" | null
  >(null);
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const timeInputFocusedRef = useRef(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => setKeyboardHeight(event.endCoordinates.height),
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0),
    );

    const loadSettings = async () => {
      try {
        const savedSettings = await getSettings();
        if (!savedSettings) return;
        const mergedSettings = { ...DEFAULT_SETTINGS, ...savedSettings };
        const availableRegion =
          regions.find((code) => code === mergedSettings.regionCode) ??
          regions[0] ??
          DEFAULT_REGION;
        const settingsWithRegion = {
          ...mergedSettings,
          regionCode: availableRegion,
        };
        settingsRef.current = settingsWithRegion;
        persistedSettingsRef.current = settingsWithRegion;
        setSettings(settingsWithRegion);
        setSelectedRegion(settingsWithRegion.regionCode);
        setActiveRegion(settingsWithRegion.regionCode);
      } catch (error) {
        console.warn("Failed to load settings", error);
        Alert.alert(
          i18n.t("settings.errorTitle", language),
          i18n.t("settings.errorMessage", language),
        );
      }
    };

    void loadSettings();

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [regions, setActiveRegion]);

  const queueSettingsSave = (
    updatedSettings: AppSettings,
    syncNotifications = false,
  ) => {
    saveQueueRef.current = saveQueueRef.current.then(async () => {
      try {
        await saveSettings(updatedSettings);
        persistedSettingsRef.current = updatedSettings;

        if (!syncNotifications) return;

        const permissionGranted = await syncScheduledNotifications(
          updatedSettings,
          language,
        );
        if (!permissionGranted) {
          const disabledSettings = {
            ...settingsRef.current,
            notificationsEnabled: false,
          };
          await saveSettings(disabledSettings);
          settingsRef.current = disabledSettings;
          persistedSettingsRef.current = disabledSettings;
          setSettings(disabledSettings);
          Alert.alert(
            i18n.t("settings.permissionRequiredTitle", language),
            i18n.t("settings.notificationsDisabledMessage", language),
          );
        }
      } catch (error) {
        console.warn("Failed to save settings", error);
        Alert.alert(
          i18n.t("settings.errorTitle", language),
          i18n.t("settings.errorMessage", language),
        );
      }
    });

    return saveQueueRef.current;
  };

  const handleRegionSelect = async (region: RegionCode) => {
    const updatedSettings = { ...settingsRef.current, regionCode: region };
    settingsRef.current = updatedSettings;
    setSettings(updatedSettings);
    setSelectedRegion(region);
    setActiveRegion(region);
    setShowRegionPicker(false);
    await queueSettingsSave(updatedSettings);
  };

  const handleOpenContact = async () => {
    try {
      await Linking.openURL(CONTACT_URL);
    } catch (error) {
      console.warn("Failed to open contact page", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("settings.errorMessage", language),
      );
    }
  };

  const updateSetting = <Key extends keyof AppSettings>(
    key: Key,
    value: AppSettings[Key],
  ) => {
    const updatedSettings = { ...settingsRef.current, [key]: value };
    settingsRef.current = updatedSettings;
    setSettings(updatedSettings);

    const isTimeValid = isValidNotificationTime(
      updatedSettings.notificationTime ?? "",
    );
    const settingsToSave =
      key === "notificationTime" && !isTimeValid
        ? {
            ...updatedSettings,
            notificationTime: persistedSettingsRef.current.notificationTime,
          }
        : updatedSettings;
    const notificationSettingKeys: (keyof AppSettings)[] = [
      "notificationsEnabled",
      "notificationsOnlyFavorites",
      "notificationFrequency",
      "notificationWeekday",
      "notificationTime",
    ];
    const shouldSyncNotifications =
      notificationSettingKeys.includes(key) && isTimeValid;

    void queueSettingsSave(settingsToSave, shouldSyncNotifications);
  };

  const selectedRegionName =
    i18n.tOptional(`regions.${selectedRegion}`, language, selectedRegion) ??
    selectedRegion;

  const handleImportFiles = async (target: "app-locale" | "region") => {
    setImportInfoTarget(null);
    try {
      const importedCount = await importFiles(target);
      if (importedCount === 0) return;
      Alert.alert(
        i18n.t("settings.importCompleteTitle", language),
        i18n.t("settings.importCompleteMessage", language),
      );
    } catch (error) {
      console.warn("Failed to import data files", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  const handleOpenDataFiles = async () => {
    try {
      await Linking.openURL(DATA_FILES_URL);
    } catch (error) {
      console.warn("Failed to open JSON examples on GitHub", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("settings.openGithubError", language),
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      ref={scrollViewRef}
      onContentSizeChange={() => {
        if (timeInputFocusedRef.current && keyboardHeight > 0) {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      }}
    >
        <View style={styles.section}>
          <View style={styles.labelHeader}>
            <Text style={styles.labelHeaderText}>
              {i18n.t("settings.language", language)}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={i18n.t("settings.addAppLanguage", language)}
              style={styles.addButton}
              onPress={() => setImportInfoTarget("app-locale")}
            >
              <MaterialIcons
                name="add"
                size={19}
                color={themeColors.primary[25]}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowLanguagePicker(true)}
          >
            <Text style={styles.selectionButtonText}>
              {languageOptions.find((option) => option.value === language)
                ?.label ?? language}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={themeColors.neutral.grey}
            />
          </TouchableOpacity>

          <View style={styles.labelHeader}>
            <Text style={styles.labelHeaderText}>
              {i18n.t("settings.region", language)}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={i18n.t("settings.addRegionFiles", language)}
              style={styles.addButton}
              onPress={() => setImportInfoTarget("region")}
            >
              <MaterialIcons
                name="add"
                size={19}
                color={themeColors.primary[25]}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowRegionPicker(true)}
          >
            <Text style={styles.selectionButtonText}>
              {selectedRegionName}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={themeColors.neutral.grey}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {i18n.t("settings.notifications", language)}
          </Text>
          <View style={styles.switchRow}>
            <Text style={styles.rowLabel}>
              {i18n.t("settings.enableNotifications", language)}
            </Text>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) =>
                updateSetting("notificationsEnabled", value)
              }
              ios_backgroundColor={themeColors.neutral.grey}
              thumbColor={themeColors.primary[25]}
              trackColor={{
                false: themeColors.neutral.grey,
                true: themeColors.primary[75],
              }}
              style={styles.switch}
            />
          </View>

          {settings.notificationsEnabled && (
            <>
              <View style={styles.switchRow}>
                <Text style={styles.rowLabel}>
                  {i18n.t("settings.onlyFavorites", language)}
                </Text>
                <Switch
                  value={settings.notificationsOnlyFavorites ?? false}
                  onValueChange={(value) =>
                    updateSetting("notificationsOnlyFavorites", value)
                  }
                  ios_backgroundColor={themeColors.neutral.grey}
                  thumbColor={themeColors.primary[25]}
                  trackColor={{
                    false: themeColors.neutral.grey,
                    true: themeColors.primary[75],
                  }}
                  style={styles.switch}
                />
              </View>

              {FREQUENCY_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked:
                      (settings.notificationFrequency ?? "monthly") ===
                      option.value,
                  }}
                  onPress={() =>
                    updateSetting("notificationFrequency", option.value)
                  }
                  style={[
                    styles.frequencyOption,
                    index === 0 && styles.firstFrequencyOption,
                    (settings.notificationFrequency ?? "monthly") ===
                      option.value && styles.selectedFrequencyOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.frequencyOptionText,
                      (settings.notificationFrequency ?? "monthly") ===
                        option.value && styles.selectedFrequencyText,
                    ]}
                  >
                    {i18n.t(option.label, language)}
                  </Text>
                </TouchableOpacity>
              ))}

              {settings.notificationFrequency === "weekly" && (
                <View
                  style={styles.weekdayRail}
                  accessibilityLabel={i18n.t(
                    "settings.notificationWeekday",
                    language,
                  )}
                >
                  <View style={styles.weekdayLine} />
                  {WEEKDAY_OPTIONS.map((option) => {
                    const isSelected =
                      (settings.notificationWeekday ?? 1) === option.value;

                    return (
                      <TouchableOpacity
                        key={option.value}
                        accessibilityRole="radio"
                        accessibilityLabel={i18n.t(option.label, language)}
                        accessibilityState={{ checked: isSelected }}
                        onPress={() =>
                          updateSetting("notificationWeekday", option.value)
                        }
                        style={styles.weekdayOption}
                      >
                        <View
                          style={[
                            styles.weekdayCircle,
                            isSelected && styles.selectedWeekdayCircle,
                          ]}
                        >
                          <Text
                            style={[
                              styles.weekdayText,
                              isSelected && styles.selectedWeekdayText,
                            ]}
                          >
                            {i18n.t(`${option.label}Short`, language)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <TextInput
                accessibilityLabel={i18n.t(
                  "settings.notificationTime",
                  language,
                )}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                onChangeText={(value) => updateSetting("notificationTime", value)}
                onBlur={() => {
                  timeInputFocusedRef.current = false;
                }}
                onEndEditing={() => {
                  if (
                    !isValidNotificationTime(
                      settingsRef.current.notificationTime ?? "",
                    )
                  ) {
                    Alert.alert(
                      i18n.t("settings.invalidTimeError", language),
                      i18n.t("settings.invalidTimeMessage", language),
                    );
                  }
                }}
                onFocus={() => {
                  timeInputFocusedRef.current = true;
                }}
                placeholder="09:00"
                style={[
                  styles.timeInput,
                  settings.notificationFrequency !== "weekly" &&
                    styles.timeInputSeparated,
                ]}
                value={settings.notificationTime ?? "09:00"}
              />
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => void handleOpenContact()}
        >
          <MaterialIcons
            name="contact-support"
            size={13}
            color={themeColors.primary[25]}
          />
          <Text style={styles.contactButtonText}>
            {i18n.t("settings.contact", language)}
          </Text>
        </TouchableOpacity>

        <View style={{ height: keyboardHeight }} />

        <Modal
          visible={showLanguagePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLanguagePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {i18n.t("settings.selectLanguage", language)}
              </Text>
              {languageOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    language === option.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    const updatedSettings = {
                      ...settingsRef.current,
                      language: option.value,
                    };
                    settingsRef.current = updatedSettings;
                    persistedSettingsRef.current = {
                      ...persistedSettingsRef.current,
                      language: option.value,
                    };
                    setSettings(updatedSettings);
                    void setLanguage(option.value);
                    setShowLanguagePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      language === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowLanguagePicker(false)}
              >
                <Text style={styles.modalCloseButtonText}>
                  {i18n.t("details.cancel", language)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showRegionPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRegionPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {i18n.t("settings.selectRegion", language)}
              </Text>
              {regions.map((code) => (
                <TouchableOpacity
                  key={code}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selectedRegion === code }}
                  style={[
                    styles.modalOption,
                    selectedRegion === code && styles.selectedOption,
                  ]}
                  onPress={() => void handleRegionSelect(code)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedRegion === code && styles.selectedOptionText,
                    ]}
                  >
                    {i18n.tOptional(`regions.${code}`, language, code) ?? code}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowRegionPicker(false)}
              >
                <Text style={styles.modalCloseButtonText}>
                  {i18n.t("details.cancel", language)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={importInfoTarget !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setImportInfoTarget(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {i18n.t(
                  importInfoTarget === "app-locale"
                    ? "settings.addLanguageTitle"
                    : "settings.addRegionTitle",
                  language,
                )}
              </Text>
              <Text style={styles.modalDescription}>
                {i18n.t(
                  importInfoTarget === "app-locale"
                    ? "settings.addLanguageInfo"
                    : "settings.addRegionInfo",
                  language,
                )}
              </Text>
              <TouchableOpacity
                accessibilityRole="link"
                style={styles.githubButton}
                onPress={() => void handleOpenDataFiles()}
              >
                <MaterialIcons
                  name="open-in-new"
                  size={15}
                  color={themeColors.primary[25]}
                />
                <Text style={styles.githubButtonText}>
                  {i18n.t("settings.viewDataFilesOnGithub", language)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.modalPrimaryButton}
                onPress={() => {
                  if (importInfoTarget) {
                    void handleImportFiles(importInfoTarget);
                  }
                }}
              >
                <Text style={styles.modalPrimaryButtonText}>
                  {i18n.t("settings.chooseJsonFiles", language)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setImportInfoTarget(null)}
              >
                <Text style={styles.modalCloseButtonText}>
                  {i18n.t("settings.close", language)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: themeColors.neutral.lightGrey,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: themeColors.primary[25],
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
    marginTop: 8,
  },
  labelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 5,
  },
  labelHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  addButton: {
    width: 28,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  selectionButton: {
    minHeight: 32,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: themeColors.neutral.lightGrey,
    marginBottom: 22,
    paddingHorizontal: 9,
    borderRadius: 4,
    backgroundColor: themeColors.neutral.white,
  },
  selectionButtonText: {
    fontSize: 12,
    color: themeColors.neutral.black,
  },
  switchRow: {
    minHeight: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switch: {
    transform: [{ scale: 0.75 }],
  },
  rowLabel: {
    color: themeColors.neutral.black,
    flex: 1,
    fontSize: 12,
    marginRight: 8,
  },
  frequencyOption: {
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: themeColors.neutral.white,
    marginBottom: 4,
  },
  firstFrequencyOption: {
    marginTop: 16,
  },
  weekdayRail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    marginTop: 14,
    marginBottom: 20,
  },
  weekdayOption: {
    alignItems: "center",
    flex: 1,
    zIndex: 1,
  },
  weekdayLine: {
    position: "absolute",
    left: 7,
    right: 7,
    top: 11,
    height: 5,
    borderRadius: 3,
    backgroundColor: themeColors.primary.main,
  },
  weekdayCircle: {
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 3,
    borderColor: themeColors.neutral.lightGrey,
    backgroundColor: themeColors.primary[75],
  },
  selectedWeekdayCircle: {
    borderColor: themeColors.primary[25],
    backgroundColor: themeColors.primary[25],
  },
  weekdayText: {
    color: themeColors.primary[25],
    fontSize: 7,
    fontWeight: "bold",
  },
  selectedWeekdayText: {
    color: themeColors.neutral.white,
  },
  selectedFrequencyOption: {
    backgroundColor: themeColors.primary.main,
  },
  frequencyOptionText: {
    color: themeColors.neutral.black,
    fontSize: 11,
  },
  selectedFrequencyText: {
    color: themeColors.neutral.white,
    fontWeight: "bold",
  },
  timeInput: {
    alignSelf: "center",
    width: 58,
    height: 37,
    borderWidth: 1,
    borderColor: themeColors.neutral.grey,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 5,
    backgroundColor: themeColors.neutral.white,
    color: themeColors.neutral.black,
    fontSize: 14,
    textAlign: "center",
  },
  timeInputSeparated: {
    marginTop: 16,
  },
  contactButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  contactButtonText: {
    color: themeColors.primary[25],
    fontSize: 11.5,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: `${themeColors.neutral.black}80`,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: themeColors.neutral.white,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: themeColors.neutral.black,
  },
  modalDescription: {
    width: "100%",
    color: themeColors.neutral.black,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "left",
    marginBottom: 8,
  },
  githubButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  githubButtonText: {
    color: themeColors.primary[25],
    fontSize: 13,
    textDecorationLine: "underline",
    marginLeft: 6,
  },
  modalPrimaryButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: themeColors.primary.main,
  },
  modalPrimaryButtonText: {
    fontSize: 15,
    color: themeColors.neutral.white,
    fontWeight: "bold",
  },
  modalOption: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: themeColors.neutral.white,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: themeColors.primary.main,
  },
  modalOptionText: {
    fontSize: 16,
    color: themeColors.neutral.black,
  },
  selectedOptionText: {
    color: themeColors.neutral.white,
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: themeColors.neutral.lightGrey,
  },
  modalCloseButtonText: {
    fontSize: 14,
    color: themeColors.neutral.black,
    fontWeight: "600",
  },
});

export default SettingsScreen;
