import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { getSettings, saveSettings } from "../services/storage";
import * as Notifications from "expo-notifications";
import { requestNotificationPermissions } from "../services/notifications";
import { useLanguage } from "../contexts/LanguageContext";
import { i18n, Language } from "../services/i18n";

const SettingsScreen = () => {
  const { language, setLanguage } = useLanguage();
  const [phone, setPhone] = useState("");
  const [notifs, setNotifs] = useState(false);
  const [notifTime, setNotifTime] = useState("09:00");
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const languageOptions = [
    { label: "English", value: "en" as Language },
    { label: "Polski", value: "pl" as Language },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await getSettings();
    if (s) {
      setPhone(s.phoneNumber);
      setNotifs(s.notificationsEnabled);
      if (s.notificationTime) setNotifTime(s.notificationTime);
    }
  };

  const handleSave = async (newNotifs?: boolean, showAlert: boolean = true) => {
    const notifValue = typeof newNotifs === "boolean" ? newNotifs : notifs;

    const [hStr, mStr] = notifTime.split(":");
    let hour = parseInt(hStr, 10);
    let minute = parseInt(mStr, 10);
    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      Keyboard.dismiss();
      Alert.alert(
        i18n.t("settings.invalidTimeError"),
        i18n.t("settings.invalidTimeMessage"),
      );
      hour = 9;
      minute = 0;
      setNotifTime("09:00");
      return;
    }

    try {
      await saveSettings({
        phoneNumber: phone,
        notificationsEnabled: notifValue,
        notificationTime: `${String(hour).padStart(2, "0")}:${String(
          minute,
        ).padStart(2, "0")}`,
        favItems: [],
      });

      if (notifValue) {
        const granted = await requestNotificationPermissions();
        if (!granted) {
          Alert.alert(
            i18n.t("settings.permissionRequiredTitle"),
            i18n.t("settings.notificationsDisabledMessage"),
          );
        } else {
          await Notifications.cancelAllScheduledNotificationsAsync();

          await Notifications.scheduleNotificationAsync({
            content: {
              title: i18n.t("notifications.title"),
              body: i18n.t("notifications.body"),
            },
            //trigger: { type: "calendar", hour, minute, repeats: true } as any,
            trigger: {
              type: "timeInterval",
              seconds: 10,
              repeats: true,
            } as any, //Na androidzie w Expo go nie działa triger callendar, więc testowo co 10 sekund
          });
        }
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
      if (showAlert) {
        Alert.alert(
          i18n.t("settings.settingsSaved"),
          i18n.t("settings.settingsSavedMessage"),
        );
      }
    } catch (error) {
      // error logged intentionally
      Keyboard.dismiss();
      if (showAlert) {
        Alert.alert(
          i18n.t("settings.errorTitle"),
          i18n.t("settings.errorMessage"),
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.label}>{i18n.t("settings.language")}</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguagePicker(true)}
        >
          <Text style={styles.languageButtonText}>
            {language === "en" ? "English" : "Polski"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showLanguagePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {i18n.t("settings.selectLanguage")}
            </Text>
            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.languageOption,
                  language === option.value && styles.selectedLanguageOption,
                ]}
                onPress={() => {
                  setLanguage(option.value);
                  setShowLanguagePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === option.value && styles.selectedLanguageText,
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
                {i18n.t("details.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: "bold", marginBottom: 5 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 8 },
  languageButton: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 12,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
  languageButtonText: {
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  languageOption: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  selectedLanguageOption: {
    backgroundColor: "#6b1d52",
  },
  languageOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedLanguageText: {
    color: "#fff",
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
    color: "#333",
    fontWeight: "600",
  },
});

export default SettingsScreen;
