import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../theme/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { addAiMealToPlan } from "../lib/api";

export default function AIGenerateScreen() {
  type NavProp = NativeStackNavigationProp<RootStackParamList, "AIGenerate">;
  const nav = useNavigation<NavProp>();

  const route = useRoute();
  const { planId, date, label } = route.params as {
    planId: string;
    date: string;
    label: string;
  };

  const [people, setPeople] = useState("2");
  const [time, setTime] = useState("");
  const [dietary, setDietary] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    try {
      setLoading(true);

      const payload = {
        date,
        label,
        preferences: {
          people,
          time,
          dietary,
          preferences,
        },
      };

      //  Call backend AI endpoint
      const aiResult = await addAiMealToPlan(planId, payload);

      // Navigate to preview screen with actual backend data
      nav.navigate("AISuggestion" as any, { aiResult });
    } catch (err: any) {
      alert(err.message || "AI meal generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hi, AI needs to know!</Text>

      <Text style={styles.label}>How many people are you cooking for?</Text>
      <TextInput
        style={styles.input}
        value={people}
        onChangeText={setPeople}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Prep and cook time?</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} />

      <Text style={styles.label}>Dietary Restrictions</Text>
      <TextInput style={styles.input} value={dietary} onChangeText={setDietary} />

      <Text style={styles.label}>Preferences</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={preferences}
        onChangeText={setPreferences}
        multiline
      />

      <TouchableOpacity
        style={styles.generateBtn}
        onPress={generate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={{ color: COLORS.white, fontFamily: "Roboto_700Bold" }}>
            Generate
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  title: { fontFamily: "Roboto_700Bold", fontSize: 20, marginBottom: 12 },
  label: { fontFamily: "Roboto_700Bold", marginTop: 8, color: COLORS.muted },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    fontFamily: "Roboto_400Regular",
  },
  generateBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
