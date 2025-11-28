import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { getPlan } from "../lib/api"; 

type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

interface MealItem {
  label: string;
  recipeTitle?: string;
}

interface Plan {
  id: string;
  startDate: string;
  days: {
    date: string;
    meals: MealItem[];
  }[];
}

export default function HomeScreen() {
  const nav = useNavigation<NavProp>();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  // In real backend you would fetch the user's latest plan.
  // For now let's assume planId = "1" until you link authentication.
  const MOCK_PLAN_ID = "1";

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const data = await getPlan(MOCK_PLAN_ID);
        setPlan(data);
      } catch (err) {
        console.log("No plan found yet:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, []);

  const formattedMeals =
    plan?.days?.flatMap((d) =>
      d.meals.map((m) => ({
        id: `${d.date}-${m.label}`,
        title: `${d.date} - ${m.label}`,
        meals: [m.recipeTitle || "No recipe selected"],
      }))
    ) || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Sara's kitchen</Text>

        {/* Loading state */}
        {loading && <ActivityIndicator size="large" color={COLORS.primary} />}

        {/* Show empty message */}
        {!loading && formattedMeals.length === 0 && (
          <Text style={{ color: COLORS.muted, marginVertical: 20 }}>
            No meal plans yet. Create your first one!
          </Text>
        )}

        {/* Render existing plan meals */}
        <FlatList
          data={formattedMeals}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.meals.join(", ")}</Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => nav.navigate("CreatePlan")}
        >
          <Text style={styles.btnText}>Create or Edit Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() =>
            nav.navigate("ShoppingList", { planId: plan?.id ?? MOCK_PLAN_ID })
          }
        >
          <Text style={styles.secondaryText}>View My Shopping List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.white },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 30,
    marginBottom: 10,
    color: COLORS.text,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  cardTitle: { fontFamily: "Roboto_700Bold", fontSize: 20 },
  cardSubtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: COLORS.muted,
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { fontFamily: "Roboto_700Bold", fontSize: 20, color: COLORS.white },
  secondaryBtn: { marginTop: 8, padding: 12, alignItems: "center" },
  secondaryText: { color: COLORS.primary, fontSize: 20 },
});
