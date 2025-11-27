import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import CustomTabBar from "./components/shared/CustomTabBar";
import HomeScreen from "./screens/HomeScreen";
import CreateMealScreen from "./screens/CreateMealScreen";
import CategoryRecipesScreen from './screens/CategoryRecipesScreen';
import SelectRecipesScreen from './screens/SelectRecipesScreen';
import { RootTabParamList } from './types/navigation';


// NOTE: Make sure to create these files in your screens directory
// import SearchScreen from './screens/SearchScreen';
// import FavoritesScreen from './screens/FavoritesScreen';
// import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
// Placeholder component for the three unbuilt screens
// It's crucial for the Tab Navigator to have 5 components defined.
const PlaceholderScreen = ({ route }: { route: any }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Screen: {route.name}</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: "Home" }}
        />

        {/* Second Tab: Favorites */}
        <Tab.Screen
          name="Favorites"
          component={PlaceholderScreen}
          options={{ tabBarLabel: "Favorites" }}
        />

        {/* Third Tab: This is the FAB target, it should be the screen the FAB navigates to. */}
        <Tab.Screen
          name="CreateMeal"
          component={CreateMealScreen}
          options={{
            tabBarLabel: "Create",
            // CRITICAL: Hides the default tab button so the custom FAB can take over
            tabBarButton: () => null,
          }}
        />

        {/* Fourth Tab: Search */}
        <Tab.Screen
          name="Search"
          component={PlaceholderScreen}
          options={{ tabBarLabel: "Search" }}
        />

        {/* Fifth Tab: Profile */}
        <Tab.Screen
          name="Profile"
          component={PlaceholderScreen}
          options={{ tabBarLabel: "Profile" }}
        />
        <Tab.Screen
            name="SelectRecipes"
            component={SelectRecipesScreen}
            
            options={{ 
                tabBarButton: () => null, // Hide from tab bar as it's not a primary tab
            }}
        />
        <Tab.Screen
            name="CategoryRecipes"
            component={CategoryRecipesScreen}
            initialParams={{ category: 'All' }}
            options={{ 
                tabBarButton: () => null, // Hide from tab bar
            }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
