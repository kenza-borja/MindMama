// AISuggestionScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { listRecipes, type Recipe } from "../lib/api";

type NavProp = NativeStackNavigationProp<RootStackParamList, "AISuggestion">;

export default function AISuggestionScreen() {
  const route: any = useRoute();
  const nav = useNavigation<NavProp>();

  const { plan, date, label, planId } = route.params || {};

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!plan) {
          setError("No plan passed to AISuggestionScreen.");
          return;
        }

        const days = plan.days || [];

        // Find the matching day by date, or fallback to last day
        let day =
          days.find((d: any) => d.date === date) || (days.length > 0 ? days[days.length - 1] : null);

        if (!day) {
          setError("Could not find a matching day in the plan.");
          return;
        }

        // Find the meal by label, or fallback to last meal
        let meal =
          day.meals?.find((m: any) => m.label === label) ||
          (day.meals && day.meals[day.meals.length - 1]);

        if (!meal || !meal.recipeId) {
          setError("Could not find a generated meal or recipeId.");
          return;
        }

        // Load recipes & match by recipeId
        const allRecipes = await listRecipes();
        const found = allRecipes.find((r: Recipe) => r.id === meal.recipeId) || null;

        if (!found) {
          setError("Recipe not found in recipe list.");
        } else {
          setRecipe(found);
        }
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Failed to load AI recipe.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [plan, date, label]);

  function handleSave() {
    // Meal is already saved by addAiMealToPlan.
    nav.navigate("Home");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.muted}>Getting your AI meal...</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "No recipe to show."}</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={{ color: COLORS.white }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title || "AI Suggestion"}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {(recipe.ingredients || []).map((i, idx) => (
        <Text key={idx} style={styles.ingredient}>
          • {i}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>
        {Array.isArray(recipe.instructions)
          ? recipe.instructions.join("\n\n")
          : recipe.instructions}
      </Text>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={{ color: COLORS.white }}>Save to Meal Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  title: { fontFamily: "Roboto_700Bold", fontSize: 20 },
  sectionTitle: { marginTop: 12, fontFamily: "Roboto_700Bold" },
  ingredient: { fontFamily: "Roboto_400Regular", marginTop: 6 },
  instructions: {
    marginTop: 6,
    fontFamily: "Roboto_400Regular",
    color: COLORS.muted,
  },
  saveBtn: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  muted: { marginTop: 10, color: COLORS.muted },
  error: { color: "red", marginBottom: 10 },
});

// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { COLORS } from "../theme/colors";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation";

// export default function AISuggestionScreen() {
//   const route: any = useRoute();
//   type NavProp = NativeStackNavigationProp<RootStackParamList, "AISuggestion">;
//   const nav = useNavigation<NavProp>();
//   const { aiResult } = route.params || {};
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{aiResult?.title || "AI Suggestion"}</Text>

//       <Text style={styles.sectionTitle}>Ingredients</Text>
//       {(aiResult?.ingredients || []).map((i: string, idx: number) => (
//         <Text key={idx} style={styles.ingredient}>
//           • {i}
//         </Text>
//       ))}

//       <Text style={styles.sectionTitle}>Instructions</Text>
//       <Text style={styles.instructions}>{aiResult?.instructions}</Text>

//       <TouchableOpacity style={styles.saveBtn} onPress={() => nav.navigate("Home" as any)}>
//         <Text style={{ color: COLORS.white }}>Save to Meal Plan</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.secondary} onPress={() => nav.navigate("RecipesLibrary" as any)}>
//         <Text style={{ color: COLORS.primary }}>Or select from saved recipes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
//   title: { fontFamily: "Roboto_700Bold", fontSize: 20 },
//   sectionTitle: { marginTop: 12, fontFamily: "Roboto_700Bold" },
//   ingredient: { fontFamily: "Roboto_400Regular", marginTop: 6 },
//   instructions: { marginTop: 6, fontFamily: "Roboto_400Regular", color: COLORS.muted },
//   saveBtn: { marginTop: 18, backgroundColor: COLORS.primary, padding: 12, alignItems: "center", borderRadius: 8 },
//   secondary: { marginTop: 10, alignItems: "center" },
// });
