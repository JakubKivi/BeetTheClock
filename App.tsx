import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ProduceDetailsScreen from "./src/screens/ProduceDetailsScreen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { RootStackParamList } from "./src/screens/ProduceDetailsScreen";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <LanguageProvider>
      <AppNavigator />
    </LanguageProvider>
  );
}
