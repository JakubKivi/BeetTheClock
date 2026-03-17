import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  SectionList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../contexts/LanguageContext";
import { i18n } from "../services/i18n";

const HomeScreen = () => {
  const { language } = useLanguage();
  const currentMonth = new Date().getMonth();
  const [targetNumber, setTargetNumber] = useState("");
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        setError(i18n.t("home.errorMessage"));
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

  const closeSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (isSearching) {
      navigation.setOptions({
        headerTitle: () => (
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={i18n.t("home.searchPlaceholder")}
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={{
              flex: 1,
              height: 40,
              backgroundColor: "transparent",
              borderRadius: 5,
              paddingHorizontal: 10,
              color: "#fff",
              fontSize: 16,
            }}
            autoFocus={true}
          />
        ),
        headerRight: () => (
          <TouchableOpacity onPress={closeSearch} style={{ marginRight: 10 }}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <Image
            source={require("../../assets/adaptive-icon.png")}
            style={{
              width: 50,
              height: 50,
              marginLeft: 15,
              tintColor: "#fff",
            }}
            resizeMode="contain"
          />
        ),
        headerTitle: "Beet The Clock",
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setIsSearching(true)}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="settings-sharp" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation, isSearching, searchQuery, language]);

  const filteredProduce = PRODUCE_DATA.filter((p) => {
    const query = searchQuery.toLowerCase();
    // Check if name contains query AND pl_name does NOT contain query
    if (language === "pl") {
      return p.pl_name.toLowerCase().includes(query);
    } else {
      return p.name.toLowerCase().includes(query);
    }
  });

  const seasonalProduce = filteredProduce.filter((p) =>
    p.months.includes(currentMonth),
  );

  const unavailableProduce = filteredProduce.filter(
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

  const handleShare = async (produce: any) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Error", i18n.t("home.smsError"));
      return;
    }
    await SMS.sendSMSAsync(
      [targetNumber],
      language === "pl"
        ? `Hej! ${produce.pl_name} jest teraz w sezonie! Jeśli chcesz wiedzieć, co jest w sezonie, sprawdź aplikację Beet The Clock!`
        : `Hey! ${produce.name} is in season right now! If you want to know what's in season, check out the Beet The Clock app!`,
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
          Alert.alert(
            i18n.t("home.permissionRequired"),
            i18n.t("home.photoAccessError"),
          );
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
      Alert.alert("Error", i18n.t("home.imageSelectError"));
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
      title: i18n.t("home.inSeason"),
      data: sortedAndBadgedProduce,
      isAvailable: true,
    },
    {
      title: i18n.t("home.outOfSeason"),
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
              onPress={() => handleShare(produceItem)}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

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
