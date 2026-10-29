import React, { useEffect } from "react";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { getSettings } from "./src/services/storage";
import { syncScheduledNotifications } from "./src/services/notifications";
import { useLanguage } from "./src/contexts/LanguageContext";

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
  return (
    <LanguageProvider>
      <NotificationSetup />
      <AppNavigator />
    </LanguageProvider>
  );
}
