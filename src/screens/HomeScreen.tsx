import React, { useEffect, useMemo, useState } from "react";
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
import type { RootStackParamList } from "../navigation/types";
import * as SMS from "expo-sms";
import * as ImagePicker from "expo-image-picker";

import { MonthOfYear, Produce } from "../types";
import { FONTS, themeColors } from "../constants/theme";
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
import { useAppData } from "../contexts/DataContext";
import { i18n } from "../services/i18n";
import {
  getSeasonality,
  SEASON_REFERENCE_DATE,
} from "../services/produceSeasonality";
import { syncScheduledNotifications } from "../services/notifications";
import {
  AppText as Text,
  AppTextInput as TextInput,
} from "../components/Typography";

const HomeScreen = () => {
  const { language } = useLanguage();
  const { produce, activeRegion: currentRegion } = useAppData();
  const currentMonth = SEASON_REFERENCE_DATE.getMonth() as MonthOfYear;
  const [targetNumber, setTargetNumber] = useState("");
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listRefreshCount, setListRefreshCount] = useState(0);
  const [isListScrolled, setIsListScrolled] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    navigation.setOptions({ headerShadowVisible: isListScrolled });
  }, [navigation, isListScrolled]);

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
            placeholderTextColor={`${themeColors.neutral.white}B3`}
            style={styles.searchInput}
            autoFocus
          />
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={closeSearch}
            style={styles.headerAction}
          >
            <Ionicons
              name="close-outline"
              size={25}
              color={themeColors.neutral.white}
            />
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
              <Ionicons
                name="search-outline"
                size={25}
                color={themeColors.neutral.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
              style={styles.headerAction}
            >
              <Ionicons
                name="settings-outline"
                size={25}
                color={themeColors.neutral.white}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation, isSearching, searchQuery, language]);

  const normalizedSearchQuery = searchQuery.toLowerCase();
  const { sortedAndBadgedProduce, sortedUnavailableProduce } = useMemo(() => {
    const seasonalProduce: Produce[] = [];
    const unavailableProduce: Produce[] = [];
    produce.forEach((item) => {
      const seasonality = getSeasonality(item, currentRegion);
      if (!seasonality) return;

      const targetList = seasonality.months.includes(currentMonth)
        ? seasonalProduce
        : unavailableProduce;
      targetList.push(item);
    });

    return {
      sortedAndBadgedProduce: sortProduceList(
        seasonalProduce,
        currentMonth,
        currentRegion,
      ),
      sortedUnavailableProduce: sortProduceList(
        unavailableProduce,
        currentMonth,
        currentRegion,
      ),
    };
  }, [produce, currentMonth, currentRegion, listRefreshCount]);
  const visibleSeasonalProduce = sortedAndBadgedProduce.filter(({ item }) => {
    const name =
      i18n.tOptional(`produce.${item.id}.name`, language) ?? item.id;
    return (
      name.toLowerCase().includes(normalizedSearchQuery) &&
      (!favoritesOnly || favorites.includes(item.id))
    );
  });
  const visibleUnavailableProduce = sortedUnavailableProduce.filter(
    ({ item }) => {
      const name =
        i18n.tOptional(`produce.${item.id}.name`, language) ?? item.id;
      return (
        name.toLowerCase().includes(normalizedSearchQuery) &&
        (!favoritesOnly || favorites.includes(item.id))
      );
    },
  );

  const handleShare = async (produce: Produce) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(i18n.t("settings.errorTitle"), i18n.t("home.smsError"));
      return;
    }
    const produceName =
      i18n.tOptional(`produce.${produce.id}.name`, language) ?? produce.id;
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
    setListRefreshCount((count) => count + 1);

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
      Alert.alert(
        i18n.t("settings.errorTitle"),
        i18n.t("settings.errorMessage"),
      );
    }
  };

  return (
    <View testID="home-container" style={styles.container}>
      <SectionList
        testID="home-list"
        sections={sections}
        keyExtractor={(item) => item.item.id}
        removeClippedSubviews={false}
        stickySectionHeadersEnabled={false}
        onScroll={(event) =>
          setIsListScrolled(event.nativeEvent.contentOffset.y > 0)
        }
        scrollEventThrottle={16}
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
                  color={
                    favoritesOnly
                      ? themeColors.neutral.white
                      : themeColors.primary[25]
                  }
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item, section, index }) => {
          const produceItem = item.item;
          const statusBadge = item.statusBadge;
          const isAvailable = section.isAvailable;
          const card = (
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
          return section.isAvailable && index === 0 ? (
            <View
              testID="first-available-item"
              style={styles.firstAvailableItem}
            >
              {card}
            </View>
          ) : (
            card
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
    paddingBottom: 20,
    backgroundColor: themeColors.neutral.lightGrey,
  },
  sectionHeaderContainer: {
    backgroundColor: themeColors.neutral.lightGrey,
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
  firstAvailableItem: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: themeColors.primary[25],
  },
  favoritesFilter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: themeColors.primary[25],
    alignItems: "center",
    justifyContent: "center",
  },
  favoritesFilterActive: {
    backgroundColor: themeColors.primary[25],
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
    color: themeColors.neutral.white,
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
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HomeScreen;
