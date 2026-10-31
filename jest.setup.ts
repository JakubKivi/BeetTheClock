import 'react-native-gesture-handler/jestSetup';

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock Expo modules before any imports
jest.mock('expo', () => ({
  __esModule: true,
}));

jest.mock('expo-file-system', () => ({
  __esModule: true,
}));

jest.mock('expo-notifications', () => ({
  __esModule: true,
  setNotificationHandler: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: false,
    assets: [{ uri: 'mock-image-uri' }],
  })),
}));

jest.mock('expo-sms', () => ({
  isAvailableAsync: jest.fn(async () => true),
  sendSMSAsync: jest.fn(),
}));

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const { composeLoadedData } = require("./src/services/deviceData");
const { i18n } = require("./src/services/i18n");
const appLocales = {
  en: require("./data/locales/en.json"),
  pl: require("./data/locales/pl.json"),
};
const region = require("./data/regions/PL.json");
const regionLocales = {
  PL: {
    en: require("./data/regions/PL/en.json"),
    pl: require("./data/regions/PL/pl.json"),
  },
};
const flatten = (value: Record<string, unknown>, prefix: string, result: Record<string, string>) => {
  for (const [key, entry] of Object.entries(value)) {
    const translationKey = `${prefix}.${key}`;
    if (typeof entry === "string") {
      result[translationKey] = entry;
    } else if (typeof entry === "object" && entry !== null && !Array.isArray(entry)) {
      flatten(entry as Record<string, unknown>, translationKey, result);
    }
  }
};
const flattenedRegionLocales = {
  PL: {
    en: {} as Record<string, string>,
    pl: {} as Record<string, string>,
  },
};
for (const language of ["en", "pl"] as const) {
  const locale = regionLocales.PL[language];
  flattenedRegionLocales.PL[language]["regions.PL"] = locale.name;
  flatten(locale.produce, "produce", flattenedRegionLocales.PL[language]);
}
composeLoadedData(appLocales, [region], flattenedRegionLocales);
i18n.setRegion("PL");
