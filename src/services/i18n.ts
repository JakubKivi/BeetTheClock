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
    "home.shareMessage":
      "Hey! {name} is in season right now! If you want to know what's in season, check out the Beet The Clock app!",
    "home.permissionRequired": "Permission required",
    "home.photoAccessError": "Access to photos is needed.",
    "home.imageSelectError": "Could not select image.",

    // SettingsScreen
    "settings.settingsSaved": "Settings saved",
    "settings.settingsSavedMessage":
      "Your settings have been saved successfully.",
    "settings.errorTitle": "Error",
    "settings.errorMessage": "Failed to save settings",
    "settings.invalidTimeError": "Invalid time",
    "settings.invalidTimeMessage": "Enter a valid time in 24-hour format.",
    "settings.permissionRequiredTitle": "Permission required",
    "settings.notificationsDisabledMessage":
      "Notifications are disabled because permission was not granted.",
    "settings.language": "Language",
    "settings.selectLanguage": "Select Language",
    "settings.region": "Region",
    "settings.selectRegion": "Select region",
    "settings.poland": "Poland",
    "settings.notifications": "Notifications",
    "settings.enableNotifications": "Enable notifications",
    "settings.onlyFavorites": "Only notify about favorites",
    "settings.frequency": "Frequency",
    "settings.frequencyMonthly": "At the start of each month",
    "settings.frequencyWeekly": "Once a week",
    "settings.notificationWeekday": "Day of the week",
    "settings.weekdaySunday": "Sunday",
    "settings.weekdayMonday": "Monday",
    "settings.weekdayTuesday": "Tuesday",
    "settings.weekdayWednesday": "Wednesday",
    "settings.weekdayThursday": "Thursday",
    "settings.weekdayFriday": "Friday",
    "settings.weekdaySaturday": "Saturday",
    "settings.frequencyDaily": "Every day",
    "settings.notificationTime": "Notification time",
    "settings.saveNotifications": "Save notification settings",
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
    "details.nutrition": "Nutritional information",
    "details.recipes": "Recipes",
    "season.new": "New",
    "season.end": "Ending",
    "months.yearRound": "Year-round",

    // Notifications
    "notifications.title": "BeetTheClock!",
    "notifications.body": "Check today's seasonal picks!",
    "notifications.favoritesBody": "Your favorite produce:",
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
    "home.shareMessage":
      "Hej! {name} jest teraz w sezonie! Jeśli chcesz wiedzieć, co jest w sezonie, sprawdź aplikację Beet The Clock!",
    "home.permissionRequired": "Wymagane uprawnienie",
    "home.photoAccessError": "Dostęp do zdjęć jest wymagany.",
    "home.imageSelectError": "Nie można wybrać obrazu.",

    // SettingsScreen
    "settings.settingsSaved": "Ustawienia zapisane",
    "settings.settingsSavedMessage":
      "Twoje ustawienia zostały pomyślnie zapisane.",
    "settings.errorTitle": "Błąd",
    "settings.errorMessage": "Nie udało się zapisać ustawień",
    "settings.invalidTimeError": "Nieprawidłowa godzina",
    "settings.invalidTimeMessage": "Wpisz poprawną godzinę w formacie 24-godzinnym.",
    "settings.permissionRequiredTitle": "Wymagane uprawnienie",
    "settings.notificationsDisabledMessage":
      "Powiadomienia są wyłączone, ponieważ nie przyznano uprawnienia.",
    "settings.language": "Język",
    "settings.selectLanguage": "Wybierz język",
    "settings.region": "Region",
    "settings.selectRegion": "Wybierz region",
    "settings.poland": "Polska",
    "settings.notifications": "Powiadomienia",
    "settings.enableNotifications": "Włącz powiadomienia",
    "settings.onlyFavorites": "Powiadamiaj tylko o ulubionych",
    "settings.frequency": "Częstotliwość",
    "settings.frequencyMonthly": "Na początku miesiąca",
    "settings.frequencyWeekly": "Raz w tygodniu",
    "settings.notificationWeekday": "Dzień tygodnia",
    "settings.weekdaySunday": "Niedziela",
    "settings.weekdayMonday": "Poniedziałek",
    "settings.weekdayTuesday": "Wtorek",
    "settings.weekdayWednesday": "Środa",
    "settings.weekdayThursday": "Czwartek",
    "settings.weekdayFriday": "Piątek",
    "settings.weekdaySaturday": "Sobota",
    "settings.frequencyDaily": "Codziennie",
    "settings.notificationTime": "Godzina powiadomienia",
    "settings.saveNotifications": "Zapisz ustawienia powiadomień",
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
    "details.nutrition": "Wartości odżywcze",
    "details.recipes": "Przepisy",
    "season.new": "Nowy",
    "season.end": "Koniec",
    "months.yearRound": "Całoroczny",

    // Notifications
    "notifications.title": "BeetTheClock!",
    "notifications.body": "Sprawdź dzisiejsze sezonowe wybory!",
    "notifications.favoritesBody": "Twoje ulubione produkty:",
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
