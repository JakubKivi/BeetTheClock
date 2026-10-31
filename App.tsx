import React, { useEffect } from "react";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { getSettings } from "./src/services/storage";
import { syncScheduledNotifications } from "./src/services/notifications";
import { useLanguage } from "./src/contexts/LanguageContext";
import { DataProvider, useAppData } from "./src/contexts/DataContext";
import { useFonts } from "expo-font";
import {
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import {
  Sansation_400Regular,
  Sansation_700Bold,
} from "@expo-google-fonts/sansation";

function NotificationSetup() {
  const { language } = useLanguage();
  const { produce, activeRegion } = useAppData();

  useEffect(() => {
    const synchronize = async () => {
      try {
        const settings = await getSettings();
        if (settings) {
          await syncScheduledNotifications(settings, language);
        }
      } catch (error) {
        console.warn("Failed to synchronize scheduled notifications", error);
      }
    };

    void synchronize();
  }, [activeRegion, language, produce]);

  return null;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Sansation_400Regular,
    Sansation_700Bold,
  });

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <DataProvider>
      <LanguageProvider>
        <NotificationSetup />
        <AppNavigator />
      </LanguageProvider>
    </DataProvider>
  );
}
