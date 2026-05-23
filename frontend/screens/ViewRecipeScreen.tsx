import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { listRecipes, type Recipe } from "../lib/api";
import { COLORS } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "ViewRecipe">;

export default function ViewRecipeScreen({ navigation, route }: Props) {
  const { recipe: singleRecipe, category } = route.params ?? {};

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(!singleRecipe);

  // If a single recipe was passed directly, show it — otherwise load the full list
  useEffect(() => {
    if (singleRecipe) return;
    listRecipes()
      .then((data) => setRecipes(data || []))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [singleRecipe]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Single recipe detail view
  if (singleRecipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Sara's kitchen</Text>
            <Ionicons name="restaurant-outline" size={24} color="#111827" />
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.recipeHeading}>{singleRecipe.title}</Text>

          {(singleRecipe.prep_time != null || singleRecipe.cook_time != null) && (
            <View style={styles.metaRow}>
              {singleRecipe.prep_time != null && (
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                  <Text style={styles.metaText}>Prep: {singleRecipe.prep_time} min</Text>
                </View>
              )}
              {singleRecipe.cook_time != null && (
                <View style={styles.metaItem}>
                  <Ionicons name="flame-outline" size={16} color="#9CA3AF" />
                  <Text style={styles.metaText}>Cook: {singleRecipe.cook_time} min</Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.sectionTitle}>Ingredients</Text>
          {(singleRecipe.ingredients || []).map((ing: string, i: number) => (
            <View key={i} style={styles.listRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{ing}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Steps</Text>
          {(singleRecipe.steps || []).map((step: string, i: number) => (
            <View key={i} style={styles.listRow}>
              <Text style={styles.stepNumber}>{i + 1}.</Text>
              <Text style={styles.listText}>{step}</Text>
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // List view — all recipes (reached from "See All" or library)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Sara's kitchen</Text>
          <Ionicons name="restaurant-outline" size={24} color="#111827" />
        </View>
        <View style={styles.headerRight} />
      </View>

      {category && (
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>{category}</Text>
        </View>
      )}

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recipes.length === 0 && (
          <Text style={styles.muted}>No recipes saved yet.</Text>
        )}

        {recipes.map((recipe, index) => (
          <TouchableOpacity
            key={recipe.id}
            style={[
              styles.recipeItem,
              index === recipes.length - 1 && styles.lastRecipeItem,
            ]}
            onPress={() =>
              navigation.navigate("ViewRecipe", { recipe })
            }
          >
            <View style={styles.recipeImagePlaceholder} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              {recipe.cook_time != null && (
                <View style={styles.recipeTimeContainer}>
                  <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                  <Text style={styles.recipeTime}>{recipe.cook_time} min</Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: "#9CA3AF", fontFamily: "Roboto_400Regular", marginTop: 20 },

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

  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },

  categoryTitleContainer: { paddingHorizontal: 16, marginTop: 16, marginBottom: 4 },
  categoryTitle: { fontSize: 28, fontWeight: "700", color: "#111827" },

  // Single recipe detail
  recipeHeading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 14, color: "#9CA3AF" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  listRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  bullet: { fontSize: 16, marginRight: 8, color: "#111827" },
  stepNumber: { fontSize: 14, fontWeight: "600", marginRight: 8, color: COLORS.primary, minWidth: 20 },
  listText: { flex: 1, fontSize: 14, color: "#374151", lineHeight: 20 },

  // List view
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lastRecipeItem: { borderBottomWidth: 0 },
  recipeImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    marginRight: 16,
  },
  recipeInfo: { flex: 1 },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  recipeTimeContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  recipeTime: { fontSize: 13, color: "#9CA3AF" },
});
