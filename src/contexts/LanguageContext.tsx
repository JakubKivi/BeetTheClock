import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, i18n } from "../services/i18n";
import { getSettings, saveSettings } from "../services/storage";

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
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const settings = await getSettings();
        const savedLanguage = (settings?.language || "en") as Language;
        setLanguageState(savedLanguage);
        i18n.setLanguage(savedLanguage);
      } catch (e) {
        console.warn("Failed to load language setting", e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      i18n.setLanguage(lang);

      const settings = await getSettings();
      if (settings) {
        await saveSettings({
          ...settings,
          language: lang,
        });
      }
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
