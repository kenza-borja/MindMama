// ShoppingListScreen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
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
  // allow any extra fields from backend
  [key: string]: any;
};

export default function ShoppingListScreen() {
  const route: any = useRoute();
  const nav = useNavigation<NavProp>();

  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          setLoading(true);
          setError(null);

          // 1) planId from navigation params, if passed
          let planId: string | null = route.params?.planId ?? null;

          // 2) else from AsyncStorage (set in CreatePlan)
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

          // Support either array or { items: [...] }
          let parsed: ShoppingListItem[] = [];
          if (Array.isArray(result)) {
            parsed = result;
          } else if (Array.isArray(result?.items)) {
            parsed = result.items;
          } else {
            // last resort – unknown structure
            parsed = [];
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

  const handleBackHome = () => {
    nav.navigate("Home");
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sara&apos;s Kitchen</Text>
        <Text style={styles.subtitle}>Your Shopping List</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        {!error && items.length === 0 && (
          <Text style={styles.muted}>
            No items yet. Create a meal plan and generate a shopping list.
          </Text>
        )}

        {!error &&
          items.length > 0 &&
          items.map((item, idx) => {
            const lineParts: string[] = [];

            if (item.quantity) {
              lineParts.push(String(item.quantity));
            }
            if (item.unit) {
              lineParts.push(item.unit);
            }
            if (item.name) {
              lineParts.push(item.name);
            }

            const line =
              lineParts.length > 0
                ? lineParts.join(" ")
                : JSON.stringify(item);

            return (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.bullet}>•</Text>
                <View>
                  <Text style={styles.itemText}>{line}</Text>
                  {item.category && (
                    <Text style={styles.itemCategory}>{item.category}</Text>
                  )}
                </View>
              </View>
            );
          })}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleBackHome}>
          <Text style={styles.primaryBtnText}>Back to Meal Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  scrollContent: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: "Roboto_700Bold", fontSize: 30, marginBottom: 8 },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 20,
    marginBottom: 16,
    color: COLORS.muted,
  },
  muted: {
    fontFamily: "Roboto_400Regular",
    color: COLORS.muted,
    marginTop: 4,
  },
  error: {
    fontFamily: "Roboto_400Regular",
    color: "red",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 6,
    marginTop: 2,
  },
  itemText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
  },
  itemCategory: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: COLORS.muted,
  },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnText: {
    color: COLORS.white,
    fontFamily: "Roboto_700Bold",
  },
});


// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, } from "react-native";
// import { getShoppingList } from "../lib/api";
// import { COLORS } from "../theme/colors";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from '@expo/vector-icons';

// interface ShoppingListScreenProps {
//   navigation: any;
//   route: any;
// }
// const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ navigation, route }) => {
//   const [items, setItems] = useState<any[]>([]);

//   useEffect(() => {
//     // For demo, pass a planId if you have one; otherwise this will error if API offline
//     getShoppingList("demo-plan-id")
//       .then((data) => setItems(data.items || []))
//       .catch(() => {
//         // fallback demo data
//         setItems(["Milk", "Chicken", "Olives"]);
//       });
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//       <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.navigate('Home')}
//         >
//           <Ionicons name="chevron-back" size={28} color="#111827" />
//         </TouchableOpacity>
        
//         <View style={styles.titleContainer}>
//           <Text style={styles.titleText}>Sara's kitchen</Text>
//           <Ionicons name="restaurant-outline" size={24} color="#111827" />
//         </View>
        
//         <View style={styles.headerRight} />
//       </View>
//       <View >
//       <Text style={styles.title}>This is your shopping list!</Text>

//       <FlatList data={items} keyExtractor={(i, idx) => String(idx)} renderItem={({ item }) => <Text style={styles.item}>• {item}</Text>} />
//     </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//    header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   titleText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   headerRight: {
//     width: 40,
//   },
//   container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
//   title: { fontFamily: "Roboto_700Bold", fontSize: 22, marginBottom: 12 },
//   item: { fontFamily: "Roboto_400Regular", marginVertical: 4 },
// });

// export default ShoppingListScreen;