import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, CommonActions } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { listRecipes, type Recipe } from "../lib/api";

type NavProp = NativeStackNavigationProp<RootStackParamList, "AISuggestion">;

export default function AISuggestionScreen() {
  const route: any = useRoute();
  const nav = useNavigation<NavProp>();

  const { plan, date, label, planId, selectedDays, selectedMealTypes, slotIndex } = route.params || {};

  // Build all slots and find the next one after this
  const slots: { date: string; label: string }[] = [];
  if (selectedDays && selectedMealTypes) {
    for (const d of selectedDays) {
      for (const m of selectedMealTypes) {
        slots.push({ date: d, label: m });
      }
    }
  }
  const currentIndex = slotIndex ?? 0;
  const nextSlot = slots[currentIndex + 1] ?? null;
  const totalSlots = slots.length;

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

        const day =
          days.find((d: any) => d.date === date) ||
          (days.length > 0 ? days[days.length - 1] : null);

        if (!day) {
          setError("Could not find a matching day in the plan.");
          return;
        }

        const meal =
          day.meals?.find((m: any) => m.label === label) ||
          (day.meals && day.meals[day.meals.length - 1]);

        if (!meal || !meal.recipeId) {
          setError("Could not find a generated meal or recipeId.");
          return;
        }

        const allRecipes: Recipe[] = await listRecipes();
        const found =
          allRecipes.find((r: Recipe) => r.id === meal.recipeId) || null;

        if (!found) {
          setError("Recipe not found in recipe list.");
        } else {
          setRecipe(found);
          console.log("AI recipe from backend:", found);
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

  function handleNext() {
    if (nextSlot) {
      nav.navigate("AIGenerate" as any, {
        planId,
        date: nextSlot.date,
        label: nextSlot.label,
        selectedDays,
        selectedMealTypes,
        slotIndex: currentIndex + 1,
      });
    } else {
      nav.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" as any, params: { planId } }],
        })
      );
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingArea}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.muted}>Getting your AI meal...</Text>
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.loadingArea}>
        <Text style={styles.errorText}>{error || "No recipe to show."}</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
          <Text style={styles.actionBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Derive cook/prep time display
  const totalTime =
    ((recipe as any).cook_time || 0) + ((recipe as any).prep_time || 0);

  // Build instructions content
  const stepsSource: any = (recipe as any).steps || (recipe as any).instructions || (recipe as any).method;
  const stepsArray: string[] = Array.isArray(stepsSource)
    ? stepsSource
    : typeof stepsSource === "string"
    ? [stepsSource]
    : ["No instructions provided by AI."];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Purple top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle}>
            {date} · {label}
          </Text>
          {totalSlots > 1 && (
            <Text style={styles.topBarSubtitle}>
              Meal {currentIndex + 1} of {totalSlots}
            </Text>
          )}
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero card */}
        <View style={styles.heroCard}>
          <Text style={styles.recipeTitle}>{recipe.title || "AI Suggestion"}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.mealTypePill}>
              <Text style={styles.mealTypePillText}>{label}</Text>
            </View>
            {totalTime > 0 && (
              <Text style={styles.timeText}>~{totalTime} min</Text>
            )}
          </View>
        </View>

        {/* Ingredients card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>INGREDIENTS</Text>
          {(recipe.ingredients || []).map((ingredient: string, idx: number) => (
            <View key={idx} style={styles.ingredientRow}>
              <Text style={styles.ingredientDot}>●</Text>
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* Instructions card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>METHOD</Text>
          {stepsArray.map((step: string, idx: number) => (
            <View key={idx} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{stepsArray.length > 1 ? `${idx + 1}.` : ""}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed bottom action button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
          <Text style={styles.actionBtnText}>
            {nextSlot ? `Next: ${nextSlot.date} ${nextSlot.label} →` : "View Meal Plan"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  loadingArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    padding: 18,
  },
  topBar: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: "Roboto_400Regular",
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
  },
  topBarTitle: {
    color: COLORS.white,
    fontFamily: "Roboto_700Bold",
    fontSize: 17,
  },
  topBarSubtitle: {
    color: COLORS.white,
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  scrollView: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: 16 },
  heroCard: {
    backgroundColor: COLORS.cardBg,
    padding: 20,
  },
  recipeTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 12,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mealTypePill: {
    backgroundColor: COLORS.primary + "22",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  mealTypePillText: {
    fontFamily: "Roboto_700Bold",
    fontSize: 12,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  timeText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: COLORS.muted,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    fontFamily: "Roboto_700Bold",
    fontSize: 12,
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  ingredientDot: {
    color: COLORS.primary,
    fontSize: 8,
    marginTop: 5,
  },
  ingredientText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 8,
  },
  stepNumber: {
    fontFamily: "Roboto_700Bold",
    fontSize: 14,
    color: COLORS.primary,
    minWidth: 20,
  },
  stepText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EDE7F6",
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  actionBtnText: {
    color: COLORS.white,
    fontFamily: "Roboto_700Bold",
    fontSize: 15,
  },
  muted: { marginTop: 10, color: COLORS.muted, fontFamily: "Roboto_400Regular" },
  errorText: { color: "red", marginBottom: 10, fontFamily: "Roboto_400Regular" },
});
