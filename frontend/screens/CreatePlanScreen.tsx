import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../theme/colors";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { createPlan, mergePlanDays } from "../lib/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const RECIPESOURCE = ["Suggestion from AI", "New Recipe", "Saved"];

type NavProp = NativeStackNavigationProp<RootStackParamList, "CreatePlan">;

export default function CreatePlanScreen() {
  const nav = useNavigation<NavProp>();

  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday"]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([
    "Lunch",
  ]);
  const [selectedRecipeSource, setSelectedRecipeSource] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  function toggleDay(day: string) {
    setSelectedDays((s) =>
      s.includes(day) ? s.filter((d) => d !== day) : [...s, day]
    );
  }

  function toggleMeal(m: string) {
    setSelectedMealTypes((s) =>
      s.includes(m) ? s.filter((x) => x !== m) : [...s, m]
    );
  }

  async function handleNext() {
    if (!selectedRecipeSource) {
      alert("Please choose a recipe source.");
      return;
    }

    if (selectedDays.length === 0 || selectedMealTypes.length === 0) {
      alert("Please select at least one day and one meal.");
      return;
    }

    try {
      setLoading(true);

      const newDays = selectedDays.map((d) => ({
        date: d,
        meals: selectedMealTypes,
      }));

      let planId: string | null = await AsyncStorage.getItem("currentPlanId");

      if (!planId) {
        // First time — create the plan
        const startDate = new Date().toISOString().slice(0, 10);
        const plan = await createPlan({ startDate, days: newDays });
        planId = plan.id;
        await AsyncStorage.setItem("currentPlanId", planId);
      } else {
        // Existing plan — add any newly selected days without touching existing data
        await mergePlanDays(planId, newDays);
      }

      const firstDay = selectedDays[0];
      const firstMeal = selectedMealTypes[0];

      if (selectedRecipeSource === "Suggestion from AI") {
        nav.navigate("AIGenerate", {
          planId,
          date: firstDay,
          label: firstMeal,
          selectedDays,
          selectedMealTypes,
          slotIndex: 0,
        });
      } else if (selectedRecipeSource === "New Recipe") {
        nav.navigate("CreateRecipe");
      } else if (selectedRecipeSource === "Saved") {
        nav.navigate("MealPlan", {
          numberOfDays: selectedDays.length,
          selectedDays,
          selectedMealTypes,
          selectedRecipeOption: selectedRecipeSource,
          planId,
        });
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to create plan.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    nav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Home" }] }));
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.title}>Sara's Kitchen</Text>
        <Text style={styles.subtitle}>Let's create your meals !</Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            Which days would you like to plan for?
          </Text>
          <View style={styles.rowWrap}>
            {DAYS.map((d) => {
              const selected = selectedDays.includes(d);
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => toggleDay(d)}
                  style={[
                    styles.pill,
                    selected && { backgroundColor: COLORS.pillSelected },
                  ]}
                >
                  <Text style={styles.pillText}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.label, { marginTop: 18 }]}>Which meals?</Text>
          <View style={styles.rowWrap}>
            {MEALS.map((m) => {
              const selected = selectedMealTypes.includes(m);
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => toggleMeal(m)}
                  style={[
                    styles.pill,
                    selected && { backgroundColor: COLORS.pillSelected },
                  ]}
                >
                  <Text style={styles.pillText}>{m}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.label, { marginTop: 18 }]}>Recipe Source</Text>
          <View style={styles.rowWrap}>
            {RECIPESOURCE.map((m) => {
              const selected = selectedRecipeSource === m;
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => setSelectedRecipeSource(m)}
                  style={[
                    styles.pill,
                    selected && { backgroundColor: COLORS.pillSelected },
                  ]}
                >
                  <Text style={styles.pillText}>{m}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateBtn}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={{ color: COLORS.white, fontFamily: "Roboto_700Bold" }}>
            {loading ? "Please wait..." : "Next"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 8,
  },
  closeBtnText: {
    fontSize: 22,
    color: COLORS.muted,
  },
  title: { fontFamily: "Roboto_700Bold", fontSize: 30, marginBottom: 12 },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 20,
    marginBottom: 20,
    color: COLORS.muted,
  },
  label: { fontFamily: "Roboto_700Bold", marginBottom: 8, color: COLORS.muted },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: { fontFamily: "Roboto_400Regular" },
  generateBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import { COLORS } from "../theme/colors";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation";
// import { SafeAreaView } from "react-native-safe-area-context";

// const DAYS = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];
// const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];
// const RECIPESOURCE = ["Suggestion from AI", "New Recipe", "Saved"];

// export default function CreatePlanScreen() {
//   type NavProp = NativeStackNavigationProp<RootStackParamList, "CreatePlan">;
//   const nav = useNavigation<NavProp>();

//   const [selectedDays, setSelectedDays] = useState<string[]>(["Monday"]);
//   const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([
//     "Lunch",
//   ]);
//   const [selectedRecipeSource, setSelectedRecipeSource] = useState<
//     string | null
//   >(null);

//   function toggleDay(day: string) {
//     setSelectedDays((s) =>
//       s.includes(day) ? s.filter((d) => d !== day) : [...s, day]
//     );
//   }
//   function toggleMeal(m: string) {
//     setSelectedMealTypes((s) =>
//       s.includes(m) ? s.filter((x) => x !== m) : [...s, m]
//     );
//   }
//   function handleNext() {
//     if (!selectedRecipeSource) return;

//     if (selectedRecipeSource === "Suggestion from AI") {
//       nav.navigate("AIGenerate", {
//         planId: "1",
//         date: selectedDays[0],
//         label: selectedMealTypes[0],
//       });
//     } else if (selectedRecipeSource === "New Recipe") {
//       nav.navigate("CreateRecipe");
//     } else if (selectedRecipeSource === "Saved") {
// nav.navigate("MealPlan", {
//         numberOfDays: selectedDays.length,
//         selectedDays: selectedDays,
//         selectedRecipeOption: selectedRecipeSource,
//     });    }
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <Text style={styles.title}>Sara's Kitchen</Text>
//         <Text style={styles.subtitle}>Let's create your meals !</Text>

//         <View style={styles.card}>
//           <Text style={styles.label}>
//             Which days would you like to plan for?
//           </Text>
//           <View style={styles.rowWrap}>
//             {DAYS.map((d) => {
//               const selected = selectedDays.includes(d);
//               return (
//                 <TouchableOpacity
//                   key={d}
//                   onPress={() => toggleDay(d)}
//                   style={[
//                     styles.pill,
//                     selected && { backgroundColor: COLORS.pillSelected },
//                   ]}
//                 >
//                   <Text style={styles.pillText}>{d}</Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         <View style={styles.card}>
//           <Text style={[styles.label, { marginTop: 18 }]}>Which meals?</Text>
//           <View style={styles.rowWrap}>
//             {MEALS.map((m) => {
//               const selected = selectedMealTypes.includes(m);
//               return (
//                 <TouchableOpacity
//                   key={m}
//                   onPress={() => toggleMeal(m)}
//                   style={[
//                     styles.pill,
//                     selected && { backgroundColor: COLORS.pillSelected },
//                   ]}
//                 >
//                   <Text style={styles.pillText}>{m}</Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         <View style={styles.card}>
//           <Text style={[styles.label, { marginTop: 18 }]}>Recipe Source</Text>
//           <View style={styles.rowWrap}>
//             {RECIPESOURCE.map((m) => {
//               const selected = selectedRecipeSource === m;
//               return (
//                 <TouchableOpacity
//                   key={m}
//                   onPress={() => setSelectedRecipeSource(m)}
//                   style={[
//                     styles.pill,
//                     selected && { backgroundColor: COLORS.pillSelected },
//                   ]}
//                 >
//                   <Text style={styles.pillText}>{m}</Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         <TouchableOpacity style={styles.generateBtn} onPress={handleNext}>
//           <Text style={{ color: COLORS.white, fontFamily: "Roboto_700Bold" }}>
//             Next
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
//   title: { fontFamily: "Roboto_700Bold", fontSize: 30, marginBottom: 12 },
//   subtitle: {
//     fontFamily: "Roboto_400Regular",
//     fontSize: 20,
//     marginBottom: 20,
//     color: COLORS.muted,
//   },
//   label: { fontFamily: "Roboto_700Bold", marginBottom: 8, color: COLORS.muted },
//   card: {
//     padding: 12,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 8,
//     marginBottom: 10,
//     marginTop: 10,
//   },

//   rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
//   pill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   pillText: { fontFamily: "Roboto_400Regular" },
//   generateBtn: {
//     marginTop: 24,
//     backgroundColor: COLORS.primary,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//   },
// });
