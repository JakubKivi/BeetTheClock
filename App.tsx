import React, { useEffect } from "react";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { getSettings } from "./src/services/storage";
import { syncScheduledNotifications } from "./src/services/notifications";
import { useLanguage } from "./src/contexts/LanguageContext";
import { useFonts } from "expo-font";
import {
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import {
  Sansation_400Regular,
  Sansation_700Bold,
} from "@expo-google-fonts/sansation";

function NotificationSetup() {
  const { language } = useLanguage();

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
  }, [language]);

  return null;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Sansation_400Regular,
    Sansation_700Bold,
  });

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <LanguageProvider>
      <NotificationSetup />
      <AppNavigator />
    </LanguageProvider>
  );
}
