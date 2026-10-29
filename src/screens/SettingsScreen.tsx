import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "../constants/theme";
import {
  REGIONS,
  RegionCode,
  NotificationFrequency,
  NotificationWeekday,
} from "../types";
import { Language, i18n } from "../services/i18n";
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
import { CONTACT_URL } from "../constants/links";

const LANGUAGE_OPTIONS: { label: string; value: Language }[] = [
  { label: "English", value: "en" },
  { label: "Polski", value: "pl" },
];

const REGION_OPTIONS: { label: string; value: RegionCode }[] = [
  { label: "settings.poland", value: REGIONS.POLAND },
];

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
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>(
    REGIONS.POLAND,
  );
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await getSettings();
        if (!savedSettings) return;
        const mergedSettings = { ...DEFAULT_SETTINGS, ...savedSettings };
        setSettings(mergedSettings);
        setSelectedRegion(mergedSettings.regionCode ?? REGIONS.POLAND);
      } catch (error) {
        console.warn("Failed to load settings", error);
        Alert.alert(
          i18n.t("settings.errorTitle", language),
          i18n.t("settings.errorMessage", language),
        );
      }
    };

    void loadSettings();
  }, []);

  const handleRegionSelect = async (region: RegionCode) => {
    const updatedSettings = { ...settings, regionCode: region };
    try {
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      setSelectedRegion(region);
      setShowRegionPicker(false);
    } catch (error) {
      console.warn("Failed to save region", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("settings.errorMessage", language),
      );
    }
  };

  const handleSaveNotifications = async () => {
    if (!isValidNotificationTime(settings.notificationTime ?? "")) {
      Alert.alert(
        i18n.t("settings.invalidTimeError", language),
        i18n.t("settings.invalidTimeMessage", language),
      );
      return;
    }

    setIsSavingNotifications(true);
    try {
      await saveSettings({ ...settings, regionCode: selectedRegion });
      const permissionGranted = await syncScheduledNotifications(
        { ...settings, regionCode: selectedRegion },
        language,
      );

      if (!permissionGranted) {
        const disabledSettings = { ...settings, notificationsEnabled: false };
        await saveSettings(disabledSettings);
        setSettings(disabledSettings);
        Alert.alert(
          i18n.t("settings.permissionRequiredTitle", language),
          i18n.t("settings.notificationsDisabledMessage", language),
        );
        return;
      }

      Alert.alert(
        i18n.t("settings.settingsSaved", language),
        i18n.t("settings.settingsSavedMessage", language),
      );
    } catch (error) {
      console.warn("Failed to save notification settings", error);
      Alert.alert(
        i18n.t("settings.errorTitle", language),
        i18n.t("settings.errorMessage", language),
      );
    } finally {
      setIsSavingNotifications(false);
    }
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
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>{i18n.t("settings.language", language)}</Text>
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => setShowLanguagePicker(true)}
        >
          <Text style={styles.selectionButtonText}>
            {language === "en" ? "English" : "Polski"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>{i18n.t("settings.region", language)}</Text>
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => setShowRegionPicker(true)}
        >
          <Text style={styles.selectionButtonText}>
            {i18n.t(
              REGION_OPTIONS.find((option) => option.value === selectedRegion)
                ?.label ?? "settings.poland",
              language,
            )}
          </Text>
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
            trackColor={{ true: COLORS.primary }}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>
            {i18n.t("settings.onlyFavorites", language)}
          </Text>
          <Switch
            value={settings.notificationsOnlyFavorites ?? false}
            onValueChange={(value) =>
              updateSetting("notificationsOnlyFavorites", value)
            }
            disabled={!settings.notificationsEnabled}
            trackColor={{ true: COLORS.primary }}
          />
        </View>

        <Text style={styles.label}>{i18n.t("settings.frequency", language)}</Text>
        {FREQUENCY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{
              checked:
                (settings.notificationFrequency ?? "monthly") === option.value,
              disabled: !settings.notificationsEnabled,
            }}
            disabled={!settings.notificationsEnabled}
            onPress={() => updateSetting("notificationFrequency", option.value)}
            style={[
              styles.frequencyOption,
              (settings.notificationFrequency ?? "monthly") ===
                option.value && styles.selectedFrequencyOption,
              !settings.notificationsEnabled && styles.disabledOption,
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
          <>
            <Text style={styles.label}>
              {i18n.t("settings.notificationWeekday", language)}
            </Text>
            <View style={styles.weekdayOptions}>
              {WEEKDAY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked:
                      (settings.notificationWeekday ?? 1) === option.value,
                    disabled: !settings.notificationsEnabled,
                  }}
                  disabled={!settings.notificationsEnabled}
                  onPress={() =>
                    updateSetting("notificationWeekday", option.value)
                  }
                  style={[
                    styles.weekdayOption,
                    (settings.notificationWeekday ?? 1) === option.value &&
                      styles.selectedFrequencyOption,
                    !settings.notificationsEnabled && styles.disabledOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.frequencyOptionText,
                      (settings.notificationWeekday ?? 1) === option.value &&
                        styles.selectedFrequencyText,
                    ]}
                  >
                    {i18n.t(option.label, language)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.label}>
          {i18n.t("settings.notificationTime", language)}
        </Text>
        <TextInput
          accessibilityLabel={i18n.t("settings.notificationTime", language)}
          editable={settings.notificationsEnabled}
          keyboardType="numbers-and-punctuation"
          maxLength={5}
          onChangeText={(value) => updateSetting("notificationTime", value)}
          placeholder="09:00"
          style={[
            styles.timeInput,
            !settings.notificationsEnabled && styles.disabledOption,
          ]}
          value={settings.notificationTime ?? "09:00"}
        />
        <TouchableOpacity
          accessibilityRole="button"
          disabled={isSavingNotifications}
          onPress={() => void handleSaveNotifications()}
          style={[
            styles.saveButton,
            isSavingNotifications && styles.disabledOption,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {i18n.t("settings.saveNotifications", language)}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => void handleOpenContact()}
      >
        <MaterialIcons name="contact-support" size={20} color={COLORS.white} />
        <Text style={styles.contactButtonText}>
          {i18n.t("settings.contact", language)}
        </Text>
      </TouchableOpacity>

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
            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  language === option.value && styles.selectedOption,
                ]}
                onPress={() => {
                  setSettings((current) => ({
                    ...current,
                    language: option.value,
                  }));
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
            {REGION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedRegion === option.value }}
                style={[
                  styles.modalOption,
                  selectedRegion === option.value && styles.selectedOption,
                ]}
                onPress={() => void handleRegionSelect(option.value)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedRegion === option.value && styles.selectedOptionText,
                  ]}
                >
                  {i18n.t(option.label, language)}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
  },
  selectionButton: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginBottom: 12,
    padding: 12,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
  },
  selectionButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  switchRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },
  frequencyOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    marginBottom: 6,
  },
  weekdayOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  weekdayOption: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    minWidth: "23%",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  selectedFrequencyOption: {
    backgroundColor: COLORS.primary,
  },
  frequencyOptionText: {
    color: COLORS.text,
  },
  selectedFrequencyText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  disabledOption: {
    opacity: 0.5,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 16,
    padding: 12,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  contactButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 24,
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.text,
  },
  modalOption: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  modalCloseButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
});

export default SettingsScreen;
