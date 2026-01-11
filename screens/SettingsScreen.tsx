import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
} from "react-native";
import { getSettings, saveSettings } from "../services/storage";
import * as Notifications from "expo-notifications";
import { requestNotificationPermissions } from "../services/notifications";
import { Alert, Keyboard } from "react-native";


const SettingsScreen = () => {
  const [phone, setPhone] = useState("");
  const [notifs, setNotifs] = useState(false);
  const [notifTime, setNotifTime] = useState("09:00");

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
        "Invalid time format.",
        "Invalid time format. Please use HH:MM (24-hour). Falling back to 09:00."
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
        minute
      ).padStart(2, "0")}`,
      favItems: [],
    });

    if (notifValue) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          "Permission required",
          "Notifications are disabled. Please enable them in system settings."
        );
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "BeetTheClock!",
            body: "Check today's seasonal picks!",
          },
          //trigger: { type: "calendar", hour, minute, repeats: true } as any,
          trigger: { type: "timeInterval", seconds: 10, repeats: true } as any//Na androidzie w Expo go nie działa triger callendar, więc testowo co 10 sekund
        });
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    if (showAlert) {
      Alert.alert("Settings saved", "Your settings have been saved successfully.");
    }
  } catch (error) {
    console.log("Error saving settings:", error);
    Keyboard.dismiss();
    if (showAlert) {
      Alert.alert("Error", "Failed to save settings");
    }
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Daily Reminders</Text>
        <Switch
          value={notifs}
          onValueChange={(value) => {
            setNotifs(value);
            handleSave(value,false);
          }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.label}>Reminder Time (HH:MM)</Text>
        <TextInput
          style={styles.input}
          value={notifTime}
          onChangeText={setNotifTime}
          placeholder="09:00"
          keyboardType="numeric"
        />
      </View>

      <Button title="Save Settings" onPress={() => handleSave()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: "bold", marginBottom: 5 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
});

export default SettingsScreen;
