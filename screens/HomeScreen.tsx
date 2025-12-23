import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import * as SMS from 'expo-sms';
import { PRODUCE_DATA } from '../constants/produce';
import { Produce } from '../types';
import { getSettings } from '../services/storage';
import ProduceCard from '../components/ProduceCard';

const HomeScreen = () => {
  const [targetNumber, setTargetNumber] = useState('');
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    // Fetch saved phone number on mount
    getSettings().then(settings => {
      if (settings?.phoneNumber) setTargetNumber(settings.phoneNumber);
    });
  }, []);

  const seasonalProduce = PRODUCE_DATA.filter((p: Produce) => p.months.includes(currentMonth));

  const handleShare = async (name: string) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        [targetNumber],
        `Hey! Just a reminder that ${name} is in season right now! Let's get some.`
      );
    } else {
      Alert.alert("Error", "SMS is not available on this device.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>In Season Now 🥬</Text>
      <FlatList
        data={seasonalProduce}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProduceCard 
            item={item} 
            onPress={() => handleShare(item.name)} 
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#6b1d52' }
});

export default HomeScreen;