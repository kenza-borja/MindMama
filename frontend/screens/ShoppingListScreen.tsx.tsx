import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getShoppingList } from "../lib/api";
import { COLORS } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface ShoppingListScreenProps {
  navigation: any;
  route: any;
}

const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({
  navigation,
  route,
}) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const planId = route?.params?.planId;

    if (!planId) {
      // no plan available, show a friendly message
      setItems(["No plan selected. Please create a plan first."]);
      return;
    }

    getShoppingList(planId)
      .then((data) => {
        const apiItems =
          (data.items || []).map((item: any) => item.name || String(item)) ||
          [];
        if (apiItems.length === 0) {
          setItems(["No ingredients found for this plan yet."]);
        } else {
          setItems(apiItems);
        }
      })
      .catch(() => {
        // fallback demo data
        setItems(["Milk", "Chicken", "Olives"]);
      });
  }, [route?.params?.planId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Sara's kitchen</Text>
          <Ionicons name="restaurant-outline" size={24} color="#111827" />
        </View>

        <View style={styles.headerRight} />
      </View>

      <View>
        <Text style={styles.title}>This is your shopping list!</Text>

        <FlatList
          data={items}
          keyExtractor={(i, idx) => String(idx)}
          renderItem={({ item }) => (
            <Text style={styles.item}>• {item}</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  headerRight: {
    width: 40,
  },
  container: { flex: 1, padding: 18, backgroundColor: COLORS.white },
  title: { fontFamily: "Roboto_700Bold", fontSize: 22, marginBottom: 12 },
  item: { fontFamily: "Roboto_400Regular", marginVertical: 4 },
});

export default ShoppingListScreen;


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