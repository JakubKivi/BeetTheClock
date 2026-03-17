import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProduceDetailsScreen from "../screens/ProduceDetailsScreen";

import { RootStackParamList } from "../screens/ProduceDetailsScreen";
import { useLanguage } from "../contexts/LanguageContext";
import { i18n } from "../services/i18n";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { language } = useLanguage();

  useEffect(() => {
    i18n.setLanguage(language);
  }, [language]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#6b1d52" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: i18n.t("app.title"),
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: i18n.t("app.settings") }}
        />
        <Stack.Screen
          name="Details"
          component={ProduceDetailsScreen}
          options={{ title: i18n.t("app.produceDetails") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
