import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, i18n, isLanguage } from "../services/i18n";
import {
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
} from "../services/storage";
import { useAppData } from "./DataContext";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { languages } = useAppData();
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const settings = await getSettings();
        const savedLanguage =
          isLanguage(settings?.language) && languages.includes(settings.language)
          ? settings.language
          : languages.includes("en")
            ? "en"
            : languages[0];
        setLanguageState(savedLanguage);
        i18n.setLanguage(savedLanguage);
      } catch (e) {
        console.warn("Failed to load language setting", e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadLanguage();
  }, [languages]);

  const setLanguage = async (lang: Language) => {
    if (!languages.includes(lang)) {
      throw new Error(`Unknown language: ${lang}`);
    }
    try {
      setLanguageState(lang);
      i18n.setLanguage(lang);

      const settings = await getSettings();
      await saveSettings({
        ...DEFAULT_SETTINGS,
        ...settings,
        language: lang,
      });
    } catch (e) {
      console.warn("Failed to save language setting", e);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
