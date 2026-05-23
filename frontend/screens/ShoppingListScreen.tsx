import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { COLORS } from "../theme/colors";
import { getShoppingList } from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

type NavProp = NativeStackNavigationProp<RootStackParamList, "ShoppingList">;

type ShoppingListItem = {
  name?: string;
  quantity?: number;
  unit?: string;
  category?: string;
  [key: string]: any;
};

export default function ShoppingListScreen() {
  const route: any = useRoute();
  const nav = useNavigation<NavProp>();

  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          setLoading(true);
          setError(null);
          setChecked(new Set());

          let planId: string | null = route.params?.planId ?? null;
          if (!planId) {
            planId = await AsyncStorage.getItem("currentPlanId");
          }

          if (!planId) {
            setError("You don't have an active meal plan yet.");
            setItems([]);
            setLoading(false);
            return;
          }

          const result = await getShoppingList(planId);

          let parsed: ShoppingListItem[] = [];
          if (Array.isArray(result)) {
            parsed = result;
          } else if (Array.isArray(result?.items)) {
            parsed = result.items;
          }

          setItems(parsed);
        } catch (e: any) {
          console.error("Error loading shopping list:", e);
          setError(e?.message || "Failed to load shopping list.");
          setItems([]);
        } finally {
          setLoading(false);
        }
      }

      load();
    }, [route.params?.planId])
  );

  function toggleCheck(idx: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.muted}>Building your shopping list...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Group by category
  const grouped: Record<string, { item: ShoppingListItem; idx: number }[]> = {};
  items.forEach((item, idx) => {
    const cat = item.category?.trim() || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ item, idx });
  });
  const CATEGORY_ORDER = [
    "Meat & Poultry", "Fish & Seafood", "Vegetables", "Fruit",
    "Dairy & Eggs", "Grains & Carbs", "Legumes", "Spices & Herbs", "Pantry", "Other",
  ];
  const categories = Object.keys(grouped).sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const checkedCount = checked.size;
  const totalCount = items.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Shopping List</Text>

        {totalCount > 0 && (
          <Text style={styles.progress}>
            {checkedCount} of {totalCount} items picked
          </Text>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        {!error && items.length === 0 && (
          <Text style={styles.muted}>
            No items yet. Create a meal plan to generate your list.
          </Text>
        )}

        {!error &&
          categories.map((cat) => (
            <View key={cat} style={styles.categoryBlock}>
              <Text style={styles.categoryHeader}>{cat.toUpperCase()}</Text>
              {grouped[cat].map(({ item, idx }) => {
                const isChecked = checked.has(idx);
                // Use the first raw ingredient line if available, else name
                const label: string =
                  (Array.isArray(item.lines) && item.lines[0]) ||
                  item.name ||
                  JSON.stringify(item);

                return (
                  <Pressable
                    key={idx}
                    style={styles.itemRow}
                    onPress={() => toggleCheck(idx)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxChecked,
                      ]}
                    >
                      {isChecked && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.itemText,
                        isChecked && styles.itemTextDone,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => nav.navigate("Home")}
        >
          <Text style={styles.primaryBtnText}>Back to Meal Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 18, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 26,
    color: COLORS.text,
    marginBottom: 4,
  },
  progress: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 20,
  },
  muted: { fontFamily: "Roboto_400Regular", color: COLORS.muted, marginTop: 4 },
  error: {
    fontFamily: "Roboto_400Regular",
    color: "red",
    marginBottom: 8,
  },
  categoryBlock: {
    marginBottom: 20,
  },
  categoryHeader: {
    fontFamily: "Roboto_700Bold",
    fontSize: 11,
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.primary + "33",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EBF8",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
  },
  itemText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  itemTextDone: {
    textDecorationLine: "line-through",
    color: COLORS.muted,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnText: { color: COLORS.white, fontFamily: "Roboto_700Bold" },
});
