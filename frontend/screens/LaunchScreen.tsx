import React, { useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import  "../assets/logo.png";
import { RootStackParamList } from "../navigation";
export default function LaunchScreen() {
  type NavProp = NativeStackNavigationProp<RootStackParamList, "Launch">;
const nav = useNavigation<NavProp>();

  useEffect(() => {
    const t = setTimeout(() => nav.navigate("Home"), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => nav.navigate("Home")} activeOpacity={0.8}>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.launchBg, alignItems: "center", justifyContent: "center" },
  logo: { width: 200, height: 200 },
});
