import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LaunchScreen from "../screens/LaunchScreen";
import HomeScreen from "../screens/HomeScreen";
import CreatePlanScreen from "../screens/CreatePlanScreen";
import AIGenerateScreen from "../screens/AIGenerateScreen";
import AISuggestionScreen from "../screens/AISuggestionScreen";
import RecipesLibraryScreen from "../screens/RecipesLibraryScreen";
import ViewRecipeScreen from "../screens/ViewRecipeScreen";
import MealPlanScreen from "screens/MealPlanScreen";
import CreateRecipeScreen from "screens/CreateRecipeScreen";
import ShoppingListScreen from "screens/ShoppingListScreen.tsx";

export type RootStackParamList = {
  Launch: undefined;
  Home: undefined;
  CreatePlan: undefined;
  AIGenerate: { planId?: string; date?: string; label?: string } | undefined;
  AISuggestion: { aiResult?: any; planId?: string } | undefined;
  RecipesLibrary: { planId?: string } | undefined;
  ViewRecipe: { category: string; recipe?: any; planId?: string } | undefined;
  ShoppingList: { planId?: string } | undefined;
  MealPlan: {
    numberOfDays: number;
    selectedDays: string[];
    selectedRecipeOption: string;
  };
  CreateRecipe: { planId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Launch"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Launch" component={LaunchScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreatePlan" component={CreatePlanScreen} />
      <Stack.Screen name="AIGenerate" component={AIGenerateScreen} />
      <Stack.Screen name="AISuggestion" component={AISuggestionScreen} />
      <Stack.Screen name="RecipesLibrary" component={RecipesLibraryScreen} />
      <Stack.Screen name="ViewRecipe" component={ViewRecipeScreen} />
      <Stack.Screen name="MealPlan" component={MealPlanScreen} />
      <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
    </Stack.Navigator>
  );
}
export default RootNavigator;
