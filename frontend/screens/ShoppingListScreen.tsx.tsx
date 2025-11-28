import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getShoppingList } from "../lib/api";
import { COLORS } from "../theme/colors";

export default function ShoppingListScreen() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // For demo, pass a planId if you have one; otherwise this will error if API offline
    getShoppingList("demo-plan-id")
      .then((data) => setItems(data.items || []))
      .catch(() => {
        // fallback demo data
        setItems(["Milk", "Chicken", "Olives"]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is your shopping list!</Text>

      <FlatList data={items} keyExtractor={(i, idx) => String(idx)} renderItem={({ item }) => <Text style={styles.item}>• {item}</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  title: { fontFamily: "Roboto_700Bold", fontSize: 22, marginBottom: 12 },
  item: { fontFamily: "Roboto_400Regular", marginVertical: 4 },
});
