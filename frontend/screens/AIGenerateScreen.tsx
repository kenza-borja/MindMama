import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../theme/colors";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { addAiMealToPlan } from "../lib/api";

type NavProp = NativeStackNavigationProp<RootStackParamList, "AIGenerate">;
type RouteProps = RouteProp<RootStackParamList, "AIGenerate">;

const PEOPLE_OPTIONS = ["1", "2", "3", "4+"];
const TIME_OPTIONS = ["15 min", "30 min", "45 min", "1 hr"];
const DIETARY_OPTIONS = ["Halal", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free"];

function timeToMinutes(t: string): number {
  if (t === "15 min") return 15;
  if (t === "30 min") return 30;
  if (t === "45 min") return 45;
  if (t === "1 hr") return 60;
  return 30;
}

export default function AIGenerateScreen() {
  const nav = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();

  const { planId, date, label, selectedDays, selectedMealTypes, slotIndex } = route.params || {};

  const totalSlots =
    selectedDays && selectedMealTypes
      ? selectedDays.length * selectedMealTypes.length
      : 1;

  const [people, setPeople] = useState("2");
  const [time, setTime] = useState("30 min");
  const [dietarySet, setDietarySet] = useState<Set<string>>(new Set(["Halal"]));
  const [preferencesText, setPreferencesText] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleDietary(option: string) {
    setDietarySet((prev) => {
      const next = new Set(prev);
      next.has(option) ? next.delete(option) : next.add(option);
      return next;
    });
  }

  async function generate() {
    if (!planId || !date || !label) {
      alert("Missing plan information. Please go back and try again.");
      return;
    }

    try {
      setLoading(true);

      const numPeople = people === "4+" ? 4 : Number(people) || 2;
      const timeAvailable = timeToMinutes(time);
      const dietaryRestrictions = Array.from(dietarySet);

      const payload = {
        date,
        label,
        preferences: {
          num_people: numPeople,
          time_available: timeAvailable,
          dietary_restrictions: dietaryRestrictions,
          preferences_text: preferencesText,
        },
      };

      const updatedPlan = await addAiMealToPlan(planId, payload);

      nav.navigate("AISuggestion" as any, {
        planId,
        date,
        label,
        plan: updatedPlan,
        selectedDays,
        selectedMealTypes,
        slotIndex,
      });

      await AsyncStorage.setItem("currentPlanId", String(planId));
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "AI meal generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Purple top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle}>Generate your meal</Text>
          {totalSlots > 1 && (
            <Text style={styles.topBarSubtitle}>
              {date} · {label} · Meal {(slotIndex ?? 0) + 1} of {totalSlots}
            </Text>
          )}
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* People picker card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Cooking for how many?</Text>
          <View style={styles.pillRow}>
            {PEOPLE_OPTIONS.map((opt) => {
              const selected = people === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setPeople(opt)}
                  style={[styles.pill, selected ? styles.pillSelected : styles.pillUnselected]}
                >
                  <Text style={[styles.pillText, selected ? styles.pillTextSelected : styles.pillTextUnselected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time picker card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Time available</Text>
          <View style={styles.pillRow}>
            {TIME_OPTIONS.map((opt) => {
              const selected = time === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setTime(opt)}
                  style={[styles.pill, selected ? styles.pillSelected : styles.pillUnselected]}
                >
                  <Text style={[styles.pillText, selected ? styles.pillTextSelected : styles.pillTextUnselected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Dietary restrictions card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Dietary restrictions</Text>
          <View style={styles.pillRow}>
            {DIETARY_OPTIONS.map((opt) => {
              const selected = dietarySet.has(opt);
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => toggleDietary(opt)}
                  style={[styles.pill, selected ? styles.pillSelected : styles.pillUnselected]}
                >
                  <Text style={[styles.pillText, selected ? styles.pillTextSelected : styles.pillTextUnselected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preferences card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Any other preferences?</Text>
          <TextInput
            style={styles.textInput}
            value={preferencesText}
            onChangeText={setPreferencesText}
            multiline
            placeholder="e.g. Moroccan, kid-friendly, one-pot"
            placeholderTextColor={COLORS.muted}
          />
        </View>

        {/* Generate button */}
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={generate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.generateBtnText}>Generate with AI ✦</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
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
  scrollContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  cardLabel: {
    fontFamily: "Roboto_700Bold",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 4,
    marginBottom: 4,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillUnselected: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
  },
  pillTextSelected: {
    color: COLORS.white,
  },
  pillTextUnselected: {
    color: COLORS.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.primary + "44",
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: COLORS.text,
    textAlignVertical: "top",
  },
  generateBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  generateBtnText: {
    color: COLORS.white,
    fontFamily: "Roboto_700Bold",
    fontSize: 16,
  },
});
