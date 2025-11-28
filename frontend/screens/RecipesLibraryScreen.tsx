import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { listRecipes } from "../lib/api";
import { COLORS } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

export default function RecipesLibraryScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);
  type NavProp = NativeStackNavigationProp<RootStackParamList, "CreatePlan">;
const nav = useNavigation<NavProp>();

  useEffect(() => {
    listRecipes().then((r) => setRecipes(r || [])).catch(() => setRecipes([]));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your recipes</Text>

      <FlatList
        data={recipes}
        keyExtractor={(i) => i.id || i._id || String(Math.random())}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => nav.navigate("ViewRecipe" as any, { recipe: item })}>
            <Text style={styles.cardTitle}>{item.name || item.title || "Recipe"}</Text>
            <Text style={styles.cardSubtitle}>{item.short || item.summary || ""}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  title: { fontFamily: "Roboto_700Bold", fontSize: 20, marginBottom: 10 },
  card: { borderWidth: 1, borderColor: COLORS.primary, padding: 12, borderRadius: 8, marginBottom: 10 },
  cardTitle: { fontFamily: "Roboto_700Bold" },
  cardSubtitle: { color: COLORS.muted, marginTop: 4 },
});
