import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "./ProduceDetailsScreen";
import * as SMS from "expo-sms";
import * as ImagePicker from "expo-image-picker";

import { PRODUCE_DATA } from "../constants/produce";
import { Produce } from "../types";
import { getSettings } from "../services/storage";
import ProduceCard from "../components/ProduceCard";
import { getProduceIcons, saveProduceIcon } from "../services/newIcon";
import { sortProduceList } from "../services/sortProduceList";

const HomeScreen = () => {
  const currentMonth = new Date().getMonth();
  const [targetNumber, setTargetNumber] = useState("");
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigateToDetails = (item: Produce) => {
    navigation.navigate("Details", {
      item,
      iconUri: icons[item.id],
      onPickImage: handlePickImage,
      onResetIcon: handleResetIcon,
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await getSettings();
        if (settings?.phoneNumber) setTargetNumber(settings.phoneNumber);
        setFavorites(settings?.favItems || []);
        const storedIcons = await getProduceIcons();
        setIcons(storedIcons);
      } catch (e) {
        console.log(e);
        setError("Failed to load Home screen.");
      }
    };
    load();
  }, []);

  // Refresh when screen is focused to pick up favorite changes
  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        try {
          const settings = await getSettings();
          setFavorites(settings?.favItems || []);
          setRefreshTrigger((prev) => prev + 1);
        } catch (e) {
          console.log(e);
        }
      };
      loadFavorites();
    }, [])
  );

  const seasonalProduce = PRODUCE_DATA.filter((p) =>
    p.months.includes(currentMonth)
  );

  const sortedAndBadgedProduce = sortProduceList(
    seasonalProduce,
    favorites,
    currentMonth
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

  
  const handlePickImage = async (produceId: string): Promise<string | null> => {
  try {
    const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!response.granted) {
        Alert.alert("Permission required", "Access to photos is needed.");
        return null;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) return null;

    const uri = result.assets[0].uri;

    await saveProduceIcon(produceId, uri);
    setIcons(prev => ({ ...prev, [produceId]: uri }));
    return uri;
  } catch (e) {
    console.log("ImagePicker error:", e);
    Alert.alert("Error", "Could not select image.");
    return null;
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
        data={sortedAndBadgedProduce}
        keyExtractor={(item) => item.item.id}
        extraData={refreshTrigger}
        renderItem={({ item: { item, statusBadge } }) => (
          <ProduceCard
            item={item}
            iconUri={icons[item.id]}
            onPickImage={handlePickImage}
            onResetIcon={handleResetIcon}
            onPress={() => handleShare(item.name)}
            onCardPress={() => handleNavigateToDetails(item)}
            statusBadge={statusBadge}
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
