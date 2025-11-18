import React from "react";
import { SafeAreaView, Text, StatusBar } from "react-native";
import MealPlannerScreen from "./src/screens/MealPlannerScreen";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <MealPlannerScreen />
    </SafeAreaView>
  );
}
