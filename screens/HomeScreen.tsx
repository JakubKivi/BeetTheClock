import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import * as SMS from "expo-sms";
import * as ImagePicker from "expo-image-picker";

import { PRODUCE_DATA } from "../constants/produce";
import { Produce } from "../types";
import { getSettings } from "../services/storage";
import ProduceCard from "../components/ProduceCard";
import { getProduceIcons, saveProduceIcon } from "../services/newIcon";

const HomeScreen = () => {
  const currentMonth = new Date().getMonth();
  const [targetNumber, setTargetNumber] = useState("");
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await getSettings();
        if (settings?.phoneNumber) setTargetNumber(settings.phoneNumber);
        const storedIcons = await getProduceIcons();
        setIcons(storedIcons);
      } catch (e) {
        console.log(e);
        setError("Failed to load Home screen.");
      }
    };
    load();
  }, []);

  const seasonalProduce = PRODUCE_DATA.filter((p) =>
    p.months.includes(currentMonth)
  );

  const handleShare = async (name: string) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Error", "SMS not available");
      return;
    }
    await SMS.sendSMSAsync(
      [targetNumber],
      `Hey! ${name} is in season right now!`
    );
  };

  // Funkcja resetująca ikonę
const handleResetIcon = async (produceId: string) => {
  const newIcons = { ...icons };
  delete newIcons[produceId]; 
  setIcons(newIcons);// usuwa URI dla tego produktu
  await saveProduceIcon(produceId, ""); // zapisuje pusty string w AsyncStorage
  
};

  
  const handlePickImage = async (produceId: string) => {
  try {
    const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!response.granted) {
        Alert.alert("Permission required", "Access to photos is needed.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) return;

    const uri = result.assets[0].uri;

    await saveProduceIcon(produceId, uri);
    setIcons(prev => ({ ...prev, [produceId]: uri }));

  } catch (e) {
    console.log("ImagePicker error:", e);
    Alert.alert("Error", "Could not select image.");
  }
};



  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>In Season Now:</Text>
      <FlatList
        data={seasonalProduce}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProduceCard
            item={item}
            iconUri={icons[item.id]}
            onPickImage={handlePickImage}
            onResetIcon={handleResetIcon}
            onPress={() => handleShare(item.name)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6b1d52",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
