import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProduceDetailsScreen from "./screens/ProduceDetailsScreen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { RootStackParamList } from "./screens/ProduceDetailsScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
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
          options={({ navigation }) => ({
            title: "BeetTheClock 🕒",
            // Add the gear icon on the right
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                style={{ marginRight: 10 }} // Add some spacing
              >
                <Ionicons name="settings-sharp" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
        <Stack.Screen
          name="Details"
          component={ProduceDetailsScreen}
          options={{ title: "Produce Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
