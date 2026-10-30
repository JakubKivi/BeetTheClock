import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  SectionList,
  StyleSheet,
  Alert,
  TouchableOpacity,
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
import { MonthOfYear, Produce, RegionCode } from "../types";
import { COLORS, FONTS } from "../constants/theme";
import {
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
} from "../services/storage";
import ProduceCard from "../components/ProduceCard";
import { getProduceIcons, saveProduceIcon } from "../services/newIcon";
import { sortProduceList } from "../services/sortProduceList";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../contexts/LanguageContext";
import { i18n } from "../services/i18n";
import {
  DEFAULT_REGION,
  getSeasonality,
  isAvailableInRegion,
  SEASON_REFERENCE_DATE,
} from "../services/produceSeasonality";
import { syncScheduledNotifications } from "../services/notifications";
import {
  AppText as Text,
  AppTextInput as TextInput,
} from "../components/Typography";

const HomeScreen = () => {
  const { language } = useLanguage();
  const currentMonth = SEASON_REFERENCE_DATE.getMonth() as MonthOfYear;
  const [currentRegion, setCurrentRegion] = useState<RegionCode>(DEFAULT_REGION);
  const [targetNumber, setTargetNumber] = useState("");
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigateToDetails = (item: Produce) => {
    navigation.navigate("Details", {
      item,
      iconUri: icons[item.id],
      region: currentRegion,
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
        setCurrentRegion(settings?.regionCode ?? DEFAULT_REGION);
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
          setCurrentRegion(settings?.regionCode ?? DEFAULT_REGION);
        } catch (e) {
          console.warn("Failed to refresh favorites", e);
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
            style={styles.searchInput}
            autoFocus
          />
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={closeSearch}
            style={styles.headerAction}
          >
            <Ionicons name="close-outline" size={25} color={COLORS.white} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <View>
            <Image
              source={require("../../assets/beet_outline.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ),
        headerTitle: "Beet The Clock",
        headerRight: () => (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setIsSearching(true)}
              style={styles.headerAction}
            >
              <Ionicons name="search-outline" size={25} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              style={styles.headerAction}
            >
              <Ionicons name="settings-outline" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation, isSearching, searchQuery, language]);

  const filteredProduce = PRODUCE_DATA.filter((produce) => {
    const query = searchQuery.toLowerCase();
    if (language === "pl") {
      return produce.plName.toLowerCase().includes(query);
    } else {
      return produce.name.toLowerCase().includes(query);
    }
  });

  const seasonalProduce = filteredProduce.filter((produce) =>
    isAvailableInRegion(produce, currentRegion, currentMonth),
  );

  const unavailableProduce = filteredProduce.filter((produce) => {
    const seasonality = getSeasonality(produce, currentRegion);
    return (
      seasonality !== undefined &&
      !seasonality.months.includes(currentMonth)
    );
  });

  const sortedAndBadgedProduce = sortProduceList(
    seasonalProduce,
    currentMonth,
    currentRegion,
  );

  const sortedUnavailableProduce = sortProduceList(
    unavailableProduce,
    currentMonth,
    currentRegion,
  );
  const visibleSeasonalProduce = favoritesOnly
    ? sortedAndBadgedProduce.filter(({ item }) => favorites.includes(item.id))
    : sortedAndBadgedProduce;
  const visibleUnavailableProduce = favoritesOnly
    ? sortedUnavailableProduce.filter(({ item }) => favorites.includes(item.id))
    : sortedUnavailableProduce;

  const handleShare = async (produce: Produce) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(i18n.t("settings.errorTitle"), i18n.t("home.smsError"));
      return;
    }
    const produceName = language === "pl" ? produce.plName : produce.name;
    const message = i18n
      .t("home.shareMessage", language)
      .replace("{name}", produceName);
    await SMS.sendSMSAsync([targetNumber], message);
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
      Alert.alert(i18n.t("settings.errorTitle"), i18n.t("home.imageSelectError"));
      return null;
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const sections = [
    {
      title: i18n.t("home.inSeason"),
      data: visibleSeasonalProduce,
      isAvailable: true,
    },
    {
      title: i18n.t("home.outOfSeason"),
      data: visibleUnavailableProduce,
      isAvailable: false,
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      const settings = await getSettings();
      setFavorites(settings?.favItems || []);
      const storedIcons = await getProduceIcons();
      setIcons(storedIcons);
    } catch (error) {
      console.warn("Failed to refresh Home screen", error);
      Alert.alert(i18n.t("settings.errorTitle"), i18n.t("home.errorMessage"));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFavoritePress = async (produceId: string) => {
    try {
      const settings = await getSettings();
      const nextFavorites = new Set(settings?.favItems ?? []);
      if (nextFavorites.has(produceId)) {
        nextFavorites.delete(produceId);
      } else {
        nextFavorites.add(produceId);
      }

      const favoriteItems = Array.from(nextFavorites);
      const updatedSettings = {
        ...DEFAULT_SETTINGS,
        ...settings,
        phoneNumber: settings?.phoneNumber ?? "",
        notificationsEnabled: settings?.notificationsEnabled ?? false,
        favItems: favoriteItems,
      };
      await saveSettings(updatedSettings);
      setFavorites(favoriteItems);
      if (updatedSettings.notificationsEnabled) {
        try {
          await syncScheduledNotifications(updatedSettings, language);
        } catch (error) {
          console.warn("Failed to update favorite notifications", error);
          Alert.alert(
            i18n.t("settings.errorTitle"),
            i18n.t("settings.errorMessage"),
          );
        }
      }
    } catch (error) {
      console.warn("Failed to update favorites", error);
      Alert.alert(i18n.t("settings.errorTitle"), i18n.t("settings.errorMessage"));
    }
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.item.id}
        removeClippedSubviews={false}
        stickySectionHeadersEnabled
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        renderSectionHeader={({ section }) => (
          <View
            testID="home-section-header"
            style={styles.sectionHeaderContainer}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.isAvailable && (
              <TouchableOpacity
                testID="favorites-filter"
                accessibilityRole="switch"
                accessibilityLabel={i18n.t("home.favoritesOnly", language)}
                accessibilityState={{ checked: favoritesOnly }}
                onPress={() => setFavoritesOnly((enabled) => !enabled)}
                style={[
                  styles.favoritesFilter,
                  favoritesOnly && styles.favoritesFilterActive,
                ]}
              >
                <Ionicons
                  name={favoritesOnly ? "heart" : "heart-outline"}
                  size={19}
                  color={favoritesOnly ? COLORS.white : COLORS.A_primaryDark}
                />
              </TouchableOpacity>
            )}
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
              region={currentRegion}
              isFavorite={favorites.includes(produceItem.id)}
              onPress={() => handleShare(produceItem)}
              onCardPress={() => handleNavigateToDetails(produceItem)}
              onFavoritePress={() => handleFavoritePress(produceItem.id)}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: COLORS.homeBackground,
  },
  sectionHeaderContainer: {
    backgroundColor: COLORS.homeBackground,
    paddingTop: 6,
    paddingBottom: 8,
    marginLeft: -20,
    marginRight: -20,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.A_primaryDark,
  },
  favoritesFilter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: COLORS.A_primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  favoritesFilterActive: {
    backgroundColor: COLORS.A_primaryDark,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "transparent",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.navigation,
  },
  headerAction: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 42,
    height: 42,
    marginLeft: 12,
    marginBottom: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HomeScreen;
