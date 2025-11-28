import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from "react-native";
import { COLORS } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

const dummyPlans = [
  { id: "p1", title: "Monday's Lunch Plan", meals: ["Chicken Pie"] },
  { id: "p2", title: "Monday's Dinner Plan", meals: ["Tajine"] },
];

export default function HomeScreen() {
type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;
const nav = useNavigation<NavProp>();
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>Sara's kitchen</Text>

      <FlatList
        data={dummyPlans}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.meals.join(", ")}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={() => nav.navigate("CreatePlan" as any)}>
        <Text style={styles.btnText}>Create or Edit Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => nav.navigate("ShoppingList" as any)}>
        <Text style={styles.secondaryText}>View My Shopping List</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  padding: 20,  backgroundColor: COLORS.white },
  title: { fontFamily: "Roboto_700Bold", fontSize: 30, marginBottom: 10, color: COLORS.text },
  card: { padding: 12, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, marginBottom: 10, marginTop: 10 },
  cardTitle: { fontFamily: "Roboto_700Bold", fontSize: 20 },
  cardSubtitle: { fontFamily: "Roboto_400Regular", fontSize: 16, color: COLORS.muted, marginTop: 4 },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { fontFamily: "Roboto_700Bold", fontSize: 20, color: COLORS.white },
  secondaryBtn: { marginTop: 8, padding: 12, alignItems: "center" },
  secondaryText: { color: COLORS.primary, fontSize: 20, },
});
