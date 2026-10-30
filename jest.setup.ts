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
