import React, { useEffect, useState } from "react";
import { View, Text, SectionList, StyleSheet, Alert } from "react-native";
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from "@react-navigation/native";
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
          // ignore
        }
      };
      loadFavorites();
    }, []),
  );

  const seasonalProduce = PRODUCE_DATA.filter((p) =>
    p.months.includes(currentMonth),
  );

  const unavailableProduce = PRODUCE_DATA.filter(
    (p) => !p.months.includes(currentMonth),
  );

  const sortedAndBadgedProduce = sortProduceList(
    seasonalProduce,
    favorites,
    currentMonth,
  );

  const sortedUnavailableProduce = sortProduceList(
    unavailableProduce,
    favorites,
    currentMonth,
  );

  const handleShare = async (name: string) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Error", "SMS not available");
      return;
    }
    await SMS.sendSMSAsync(
      [targetNumber],
      `Hey! ${name} is in season right now!`,
    );
  };

  const handleResetIcon = async (produceId: string) => {
    const newIcons = { ...icons };
    delete newIcons[produceId];
    setIcons(newIcons);
    await saveProduceIcon(produceId, "");
  };

  const handlePickImage = async (produceId: string): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const response =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      setIcons((prev) => ({ ...prev, [produceId]: uri }));
      return uri;
    } catch (e) {
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

  // prepare sections so headers can stick when scrolling
  const sections = [
    {
      title: "In Season Now:",
      data: sortedAndBadgedProduce,
      isAvailable: true,
    },
    {
      title: "Out of season:",
      data: sortedUnavailableProduce,
      isAvailable: false,
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.item.id + index}
        stickySectionHeadersEnabled
        extraData={refreshTrigger}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item, section }) => {
          const produceItem = item.item;
          const statusBadge = item.statusBadge;
          const isAvailable = section.isAvailable;
          return (
            <ProduceCard
              item={produceItem}
              iconUri={icons[produceItem.id]}
              onPress={() => handleShare(produceItem.name)}
              onCardPress={() => handleNavigateToDetails(produceItem)}
              statusBadge={statusBadge}
              isAvailable={isAvailable}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  sectionHeaderContainer: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 10,
    marginLeft: -20,
    marginRight: -20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6b1d52",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
