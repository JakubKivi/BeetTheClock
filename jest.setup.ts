import 'react-native-gesture-handler/jestSetup';

// Mock react-native modules
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  TouchableOpacity: 'TouchableOpacity',
  StyleSheet: {
    create: (styles: any) => styles,
    flatten: (style: any) => {
      if (Array.isArray(style)) {
        return style.reduce((acc, item) => ({ ...acc, ...item }), {});
      }
      return style || {};
    }
  }
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
