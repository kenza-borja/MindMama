import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getHealth } from "../api";

export default function MealPlannerScreen() {
  const [status, setStatus] = useState("Checking...");

  async function checkApi() {
    const data = await getHealth();
    setStatus(data.ok ? "Backend Connected ✅" : "Backend Not Reachable ❌");
  }

  useEffect(() => {
    checkApi();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindMama</Text>
      <Text style={styles.status}>{status}</Text>
      <Button title="Check API Again" onPress={checkApi} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  status: { marginBottom: 15, fontSize: 16 },
});
