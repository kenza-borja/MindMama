import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../navigation";
import { listRecipes, addSavedMealToPlan, type Recipe } from "../lib/api";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "MealPlan">;

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function MealPlanScreen({ navigation, route }: Props) {
  const { planId, selectedDays, selectedMealTypes } = route.params;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listRecipes()
      .then((data) => setRecipes(data || []))
      .catch(() => setError("Failed to load recipes."))
      .finally(() => setLoading(false));
  }, []);

  const toggleRecipe = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNext = async () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one recipe.");
      return;
    }

    setSaving(true);
    try {
      const selected = recipes.filter((r) => selectedIds.has(r.id));

      // Build every day × meal slot
      const slots: { date: string; label: string }[] = [];
      for (const date of selectedDays) {
        for (const label of selectedMealTypes) {
          slots.push({ date, label });
        }
      }

      // Assign recipes to slots — cycle if fewer recipes than slots
      await Promise.all(
        slots.map((slot, i) =>
          addSavedMealToPlan(planId, {
            date: slot.date,
            label: slot.label,
            recipeId: selected[i % selected.length].id,
          })
        )
      );

      await AsyncStorage.setItem("currentPlanId", planId);
      navigation.navigate("Home", { planId });
    } catch (e: any) {
      alert(e?.message || "Failed to save recipes to plan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.muted}>Loading your recipes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("CreatePlan")}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Sara's kitchen</Text>
          <Ionicons name="restaurant-outline" size={24} color="#111827" />
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Select recipes to add to your plan:</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        {!error && recipes.length === 0 && (
          <Text style={styles.muted}>
            No saved recipes yet. Create one first!
          </Text>
        )}

        <View style={styles.grid}>
          {recipes.map((recipe) => {
            const added = selectedIds.has(recipe.id);
            return (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeImageContainer}>
                  <View style={styles.recipeImagePlaceholder} />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => toggleRecipe(recipe.id)}
                  >
                    <Ionicons
                      name={added ? "checkmark" : "add"}
                      size={20}
                      color={added ? "#10B981" : "#9CA3AF"}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {recipe.title}
                </Text>
                {recipe.cook_time != null && (
                  <View style={styles.recipeTimeContainer}>
                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.recipeTime}>{recipe.cook_time} min</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.nextButtonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedIds.size > 0 && styles.nextButtonActive,
          ]}
          onPress={handleNext}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {selectedIds.size > 0
                ? `Add ${selectedIds.size} recipe${selectedIds.size > 1 ? "s" : ""} to plan`
                : "Select a recipe"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  muted: { color: "#9CA3AF", fontFamily: "Roboto_400Regular" },
  error: { color: "red", marginBottom: 8, fontFamily: "Roboto_400Regular" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  titleText: { fontSize: 20, fontWeight: "600", color: "#111827" },
  headerRight: { width: 40 },

  container: { flex: 1, paddingHorizontal: 16 },
  subtitle: { fontSize: 14, color: "#111827", marginVertical: 20 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  recipeCard: { width: CARD_WIDTH },
  recipeImageContainer: { position: "relative", marginBottom: 10 },
  recipeImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
  },
  addButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 18,
  },
  recipeTimeContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  recipeTime: { fontSize: 12, color: "#9CA3AF" },

  nextButtonContainer: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
  },
  nextButton: {
    backgroundColor: "#9CA3AF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonActive: { backgroundColor: COLORS.primary },
  nextButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
