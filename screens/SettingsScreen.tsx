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

  const handleSave = async (newNotifs?: boolean) => {
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
      alert(
        "Invalid time format. Please use HH:MM (24-hour). Falling back to 09:00."
      );
      hour = 9;
      minute = 0;
      setNotifTime("09:00");
    }

    await saveSettings({
      phoneNumber: phone,
      notificationsEnabled: notifValue,
      notificationTime: `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`,
      favItems: [],
    });

    if (notifValue) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "BeetTheClock!",
          body: "Check today's seasonal picks!",
        },
        trigger: { type: "calendar", hour, minute, repeats: true } as any,
      });
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
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
            handleSave(value);
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
