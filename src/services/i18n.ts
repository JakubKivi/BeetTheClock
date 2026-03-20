export type Language = "en" | "pl";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    // App navigation
    "app.title": "Beet The Clock",
    "app.settings": "Settings",
    "app.produceDetails": "Produce Details",

    // HomeScreen
    "home.inSeason": "In Season Now:",
    "home.outOfSeason": "Out of season:",
    "home.searchPlaceholder": "Search produce...",
    "home.errorMessage": "Failed to load Home screen.",
    "home.smsError": "SMS not available",
    "home.permissionRequired": "Permission required",
    "home.photoAccessError": "Access to photos is needed.",
    "home.imageSelectError": "Could not select image.",

    // SettingsScreen
    "settings.settingsSaved": "Settings saved",
    "settings.settingsSavedMessage":
      "Your settings have been saved successfully.",
    "settings.errorTitle": "Error",
    "settings.errorMessage": "Failed to save settings",
    "settings.language": "Language",
    "settings.selectLanguage": "Select Language",
    "settings.contact": "Contact",

    // ProduceDetailsScreen
    "details.selectionGuide": "Selection Guide",
    "details.storageGuide": "Storage Guide",
    "details.wikipedia": "Wikipedia",
    "details.confirmReset": "Confirm",
    "details.areYouSure": "Are you sure?",
    "details.cancel": "Cancel",
    "details.ok": "OK",
    "details.best": "Best",

    // Notifications
    "notifications.title": "BeetTheClock!",
    "notifications.body": "Check today's seasonal picks!",
  },
  pl: {
    // App navigation
    "app.title": "Beet The Clock",
    "app.settings": "Ustawienia",
    "app.produceDetails": "Szczegóły produktu",

    // HomeScreen
    "home.inSeason": "Dostępne teraz:",
    "home.outOfSeason": "Niedostępne:",
    "home.searchPlaceholder": "Szukaj produktu...",
    "home.errorMessage": "Nie udało się załadować ekranu domowego.",
    "home.smsError": "SMS jest niedostępny",
    "home.permissionRequired": "Wymagane uprawnienie",
    "home.photoAccessError": "Dostęp do zdjęć jest wymagany.",
    "home.imageSelectError": "Nie można wybrać obrazu.",

    // SettingsScreen
    "settings.settingsSaved": "Ustawienia zapisane",
    "settings.settingsSavedMessage":
      "Twoje ustawienia zostały pomyślnie zapisane.",
    "settings.errorTitle": "Błąd",
    "settings.errorMessage": "Nie udało się zapisać ustawień",
    "settings.language": "Język",
    "settings.selectLanguage": "Wybierz język",
    "settings.contact": "Kontakt",

    // ProduceDetailsScreen
    "details.selectionGuide": "Jak wybierać",
    "details.storageGuide": "Jak przechowywać",
    "details.wikipedia": "Wikipedia",
    "details.confirmReset": "Potwierdź",
    "details.areYouSure": "Jesteś pewny?",
    "details.cancel": "Anuluj",
    "details.ok": "OK",
    "details.best": "Najlepsze",

    // Notifications
    "notifications.title": "BeetTheClock!",
    "notifications.body": "Sprawdź dzisiejsze sezonowe wybory!",
  },
};

export const i18n = {
  setLanguage: (lang: Language) => {
    currentLanguage = lang;
  },

  getLanguage: (): Language => {
    return currentLanguage;
  },

  t: (key: string, language?: Language): string => {
    const lang = language || currentLanguage;
    return translations[lang][key] || translations.en[key] || key;
  },
};

let currentLanguage: Language = "en";
