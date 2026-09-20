import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { COLORS } from "../theme/colors";
import { getPlan, listRecipes, type Recipe } from "../lib/api";
import { SafeAreaView } from "react-native-safe-area-context";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const route: any = useRoute();
  const nav = useNavigation<NavProp>();

  const [plan, setPlan] = useState<any | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          setLoading(true);
          setError(null);

          let planId: string | undefined = route.params?.planId;
          if (!planId) {
            planId = (await AsyncStorage.getItem("currentPlanId")) ?? undefined;
          }
          if (planId) {
            await AsyncStorage.setItem("currentPlanId", planId);
          }

          if (!planId) {
            setPlan(null);
            setRecipes([]);
            setLoading(false);
            return;
          }

          const [planData, recipesData] = await Promise.all([
            getPlan(planId),
            listRecipes(),
          ]);

          setPlan(planData);
          setRecipes(recipesData);
        } catch (e: any) {
          console.error("Error loading plan in Home:", e);
          setError(e?.message || "Failed to load plan.");
          setPlan(null);
          setRecipes([]);
        } finally {
          setLoading(false);
        }
      }

      load();
    }, [route.params?.planId])
  );

  const handleCreateOrEditPlan = () => {
    nav.navigate("CreatePlan");
  };

  const handleViewShoppingList = () => {
    nav.navigate("ShoppingList" as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.muted}>Loading your plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sara's Kitchen</Text>
        <Text style={styles.subtitle}>
          It's a beautiful day to cook something good!
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>THE MEAL PLAN</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        {!plan || plan.days.length === 0 ? (
          <Text style={styles.muted}>
            No meals yet. Create a plan to get started.
          </Text>
        ) : (
          plan.days.map((day: any, i: number) => {
            const allMeals: any[] = (day.meals || []).map((m: any) =>
              typeof m === "string" ? { label: m } : m
            );

            return (
              <View key={i} style={styles.mealCard}>
                <Text style={styles.mealCardHeader}>{day.date}</Text>
                {allMeals.map((meal: any, j: number) => {
                  const recipe = meal.recipeId
                    ? recipes.find((r) => r.id === meal.recipeId)
                    : null;
                  return (
                    <View key={j} style={[styles.mealRow, j > 0 && styles.mealRowBorder]}>
                      <View style={styles.mealLabelPill}>
                        <Text style={styles.mealLabelText}>{meal.label}</Text>
                      </View>
                      <Text style={styles.mealRecipeTitle} numberOfLines={1}>
                        {recipe ? recipe.title : "—"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleCreateOrEditPlan}
        >
          <Text style={styles.primaryBtnText}>Create or Edit Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleViewShoppingList}
        >
          <Text style={styles.secondaryBtnText}>View My Shopping List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  scrollContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: "Roboto_700Bold", fontSize: 30, marginBottom: 12 },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 20,
    marginBottom: 12,
    color: COLORS.muted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.4,
    marginBottom: 12,
  },
  sectionHeader: {
    fontFamily: "Roboto_700Bold",
    fontSize: 14,
    marginBottom: 12,
  },
  muted: {
    fontFamily: "Roboto_400Regular",
    color: COLORS.muted,
  },
  error: {
    fontFamily: "Roboto_400Regular",
    color: "red",
    marginBottom: 8,
  },
  mealCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 4,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  mealCardHeader: {
    fontFamily: "Roboto_700Bold",
    fontSize: 13,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  mealRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#E8E0F5",
  },
  mealLabelPill: {
    backgroundColor: COLORS.primary + "22",
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    minWidth: 70,
    alignItems: "center",
  },
  mealLabelText: {
    fontFamily: "Roboto_700Bold",
    fontSize: 11,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  mealRecipeTitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  bottomActions: {
    padding: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#EDE7F6",
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnText: {
    color: COLORS.white,
    fontFamily: "Roboto_700Bold",
  },
  secondaryBtn: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontFamily: "Roboto_700Bold",
    color: COLORS.primary,
  },
});



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { COLORS } from "../theme/colors";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation";
// import { getPlan } from "../lib/api";

// type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

// interface MealItem {
//   label: string;
//   recipeTitle?: string;
// }

// interface Plan {
//   id: string;
//   startDate: string;
//   days: {
//     date: string;
//     meals: MealItem[];
//   }[];
// }

// export default function HomeScreen() {
//   const nav = useNavigation<NavProp>();

//   const [plan, setPlan] = useState<Plan | null>(null);
//   const [loading, setLoading] = useState(true);

//   // In real backend you would fetch the user's latest plan.
//   // For now let's assume planId = "1" until you link authentication.
//   const MOCK_PLAN_ID = "1";

//   useEffect(() => {
//     const loadPlan = async () => {
//       try {
//         const data = await getPlan(MOCK_PLAN_ID);
//         setPlan(data);
//       } catch (err) {
//         console.log("No plan found yet:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPlan();
//   }, []);

//   const formattedMeals =
//     plan?.days?.flatMap((d) =>
//       d.meals.map((m) => ({
//         id: `${d.date}-${m.label}`,
//         title: `${d.date} - ${m.label}`,
//         meals: [m.recipeTitle || "No recipe selected"],
//       }))
//     ) || [];

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Sara's kitchen</Text>

//         {/* Loading state */}
//         {loading && <ActivityIndicator size="large" color={COLORS.primary} />}

//         {/* Show empty message */}
//         {!loading && formattedMeals.length === 0 && (
//           <Text style={{ color: COLORS.muted, marginVertical: 20 }}>
//             No meal plans yet. Create your first one!
//           </Text>
//         )}

//         {/* Render existing plan meals */}
//         <FlatList
//           data={formattedMeals}
//           keyExtractor={(i) => i.id}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <Text style={styles.cardTitle}>{item.title}</Text>
//               <Text style={styles.cardSubtitle}>{item.meals.join(", ")}</Text>
//             </View>
//           )}
//         />

//         <TouchableOpacity
//           style={styles.primaryBtn}
//           onPress={() => nav.navigate("CreatePlan")}
//         >
//           <Text style={styles.btnText}>Create or Edit Plan</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.secondaryBtn}
//           onPress={() =>
//             nav.navigate("ShoppingList", { planId: plan?.id ?? MOCK_PLAN_ID })
//           }
//         >
//           <Text style={styles.secondaryText}>View My Shopping List</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: COLORS.white },
//   title: {
//     fontFamily: "Roboto_700Bold",
//     fontSize: 30,
//     marginBottom: 10,
//     color: COLORS.text,
//   },
//   card: {
//     padding: 12,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 8,
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   cardTitle: { fontFamily: "Roboto_700Bold", fontSize: 20 },
//   cardSubtitle: {
//     fontFamily: "Roboto_400Regular",
//     fontSize: 16,
//     color: COLORS.muted,
//     marginTop: 4,
//   },
//   primaryBtn: {
//     backgroundColor: COLORS.primary,
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   btnText: { fontFamily: "Roboto_700Bold", fontSize: 20, color: COLORS.white },
//   secondaryBtn: { marginTop: 8, padding: 12, alignItems: "center" },
//   secondaryText: { color: COLORS.primary, fontSize: 20 },
// });
