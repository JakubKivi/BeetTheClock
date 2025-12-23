import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet } from 'react-native';
import { getSettings, saveSettings } from '../services/storage';
import * as Notifications from 'expo-notifications';

const SettingsScreen = () => {
  const [phone, setPhone] = useState('');
  const [notifs, setNotifs] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await getSettings();
    if (s) {
      setPhone(s.phoneNumber);
      setNotifs(s.notificationsEnabled);
    }
  };

  const handleSave = async () => {
    await saveSettings({ phoneNumber: phone, notificationsEnabled: notifs, favItems: [] });
    
    if (notifs) {
      // Basic notification trigger setup
      await Notifications.scheduleNotificationAsync({
        content: { title: "BeetTheClock!", body: "Check today's seasonal picks!" },
        // include explicit 'type' to satisfy CalendarTriggerInput typing
        trigger: { type: 'calendar', hour: 9, minute: 0, repeats: true } as any,
      });
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    alert("Settings saved!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Default Phone Number:</Text>
      <TextInput 
        style={styles.input} 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="phone-pad"
        placeholder="+48 000 000 000"
      />
      
      <View style={styles.row}>
        <Text>Daily Reminders</Text>
        <Switch value={notifs} onValueChange={setNotifs} />
      </View>

      <Button title="Save Preferences" onPress={handleSave} color="#6b1d52" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }
});

export default SettingsScreen;