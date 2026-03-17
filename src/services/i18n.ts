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
    "settings.dailyReminders": "Daily Reminders",
    "settings.reminderTime": "Reminder Time (HH:MM)",
    "settings.timeFormat": "09:00",
    "settings.saveButton": "Save Settings",
    "settings.invalidTimeError": "Invalid time format.",
    "settings.invalidTimeMessage":
      "Invalid time format. Please use HH:MM (24-hour). Falling back to 09:00.",
    "settings.permissionRequiredTitle": "Permission required",
    "settings.notificationsDisabledMessage":
      "Notifications are disabled. Please enable them in system settings.",
    "settings.settingsSaved": "Settings saved",
    "settings.settingsSavedMessage":
      "Your settings have been saved successfully.",
    "settings.errorTitle": "Error",
    "settings.errorMessage": "Failed to save settings",
    "settings.language": "Language",
    "settings.selectLanguage": "Select Language",

    // ProduceDetailsScreen
    "details.selectionGuide": "Selection Guide",
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
    "settings.dailyReminders": "Codzienne przypomnienia",
    "settings.reminderTime": "Czas przypomnienia (HH:MM)",
    "settings.timeFormat": "09:00",
    "settings.saveButton": "Zapisz ustawienia",
    "settings.invalidTimeError": "Nieprawidłowy format czasu.",
    "settings.invalidTimeMessage":
      "Nieprawidłowy format czasu. Proszę użyć HH:MM (format 24-godzinny). Powrót do 09:00.",
    "settings.permissionRequiredTitle": "Wymagane uprawnienie",
    "settings.notificationsDisabledMessage":
      "Powiadomienia są wyłączone. Proszę włączyć je w ustawieniach systemowych.",
    "settings.settingsSaved": "Ustawienia zapisane",
    "settings.settingsSavedMessage":
      "Twoje ustawienia zostały pomyślnie zapisane.",
    "settings.errorTitle": "Błąd",
    "settings.errorMessage": "Nie udało się zapisać ustawień",
    "settings.language": "Język",
    "settings.selectLanguage": "Wybierz język",

    // ProduceDetailsScreen
    "details.selectionGuide": "Na co zwrócić uwagę",
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
