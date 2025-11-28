// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import RootNavigator from "./navigation/index";
//import AppLoading from "expo-app-loading";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  //if (!fontsLoaded) return <AppLoading />;

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <RootNavigator />
    </NavigationContainer>
  );
}
