import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

export default function AISuggestionScreen() {
  const route: any = useRoute();
  type NavProp = NativeStackNavigationProp<RootStackParamList, "AISuggestion">;
  const nav = useNavigation<NavProp>();
  const { aiResult } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{aiResult?.title || "AI Suggestion"}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {(aiResult?.ingredients || []).map((i: string, idx: number) => (
        <Text key={idx} style={styles.ingredient}>
          • {i}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{aiResult?.instructions}</Text>

      <TouchableOpacity style={styles.saveBtn} onPress={() => nav.navigate("Home" as any)}>
        <Text style={{ color: COLORS.white }}>Save to Meal Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={() => nav.navigate("RecipesLibrary" as any)}>
        <Text style={{ color: COLORS.primary }}>Or select from saved recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  title: { fontFamily: "Roboto_700Bold", fontSize: 20 },
  sectionTitle: { marginTop: 12, fontFamily: "Roboto_700Bold" },
  ingredient: { fontFamily: "Roboto_400Regular", marginTop: 6 },
  instructions: { marginTop: 6, fontFamily: "Roboto_400Regular", color: COLORS.muted },
  saveBtn: { marginTop: 18, backgroundColor: COLORS.primary, padding: 12, alignItems: "center", borderRadius: 8 },
  secondary: { marginTop: 10, alignItems: "center" },
});
