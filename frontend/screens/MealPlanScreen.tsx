import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../types/navigation";

type MealPlanScreenProps = BottomTabScreenProps<RootTabParamList, "MealPlan">;

interface MealPlan {
  [key: string]: {
    // day
    [key: string]: Recipe | null; // meal type
  };
}

interface Recipe {
  id: string;
  title: string;
  category: string;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 80) / 4; // Space for 4-5 day columns

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Desserts", "Snack"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MealPlanScreen: React.FC<MealPlanScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    numberOfDays = 2,
    selectedDays = [],
    selectedRecipes = [],
  } = route?.params || {};

  const [dateRange, setDateRange] = useState("Nov 1 - Nov 7");
  const [activeDaysFilter, setActiveDaysFilter] = useState("2 Days");
  const [mealPlan, setMealPlan] = useState<MealPlan>({});

  // Get short day names from selected days
  const getShortDayName = (day: string) => {
    const dayMap: { [key: string]: string } = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };
    return dayMap[day] || day.substring(0, 3);
  };

  const visibleDays =
    selectedDays.length > 0
      ? selectedDays.map(getShortDayName)
      : daysOfWeek.slice(0, numberOfDays);

  // Initialize meal plan with selected recipes
  useEffect(() => {
    const initialPlan: MealPlan = {};

    visibleDays.forEach((day) => {
      initialPlan[day] = {};
      mealTypes.forEach((mealType) => {
        // Find a recipe for this meal type
        const recipe = selectedRecipes.find(
          (r: Recipe) => r.category.toLowerCase() === mealType.toLowerCase()
        );
        initialPlan[day][mealType] = recipe || null;
      });
    });

    setMealPlan(initialPlan);
  }, [visibleDays, selectedRecipes]);

  const handleAddRecipe = (day: string, mealType: string) => {
    console.log(`Add recipe for ${mealType} on ${day}`);
    // Navigate to select recipe for this slot
    navigation.navigate("CategoryRecipes", {
      category: mealType,
      day,
      returnTo: "MealPlan",
    });
  };

  const handleRecipePress = (day: string, mealType: string, recipe: Recipe) => {
    console.log(`View/Edit recipe:`, recipe);
    // Could open recipe details or edit modal
  };

  const handleValidation = () => {
    console.log("Final meal plan:", mealPlan);
    // Submit meal plan to backend
    // navigation.navigate('Success');
  };

  const handleDateChange = (direction: "prev" | "next") => {
    console.log(`Navigate to ${direction} week`);
    // Update date range
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Sara's kitchen</Text>
          <Ionicons name="restaurant-outline" size={24} color="#111827" />
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.progressActive]} />
        <View style={[styles.progressBar, styles.progressActive]} />
        <View style={[styles.progressBar, styles.progressActive]} />
        <View style={styles.progressBar} />
        <View style={styles.progressBar} />
      </View>

      {/* Date Range Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => handleDateChange("prev")}>
          <Ionicons name="chevron-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{dateRange}</Text>
        <TouchableOpacity onPress={() => handleDateChange("next")}>
          <Ionicons name="chevron-forward" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Days Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daysFilter}
        contentContainerStyle={styles.daysFilterContent}
      >
        <TouchableOpacity
          style={[
            styles.dayFilterButton,
            activeDaysFilter === "2 Days" && styles.dayFilterActive,
          ]}
          onPress={() => setActiveDaysFilter("2 Days")}
        >
          <Text
            style={[
              styles.dayFilterText,
              activeDaysFilter === "2 Days" && styles.dayFilterTextActive,
            ]}
          >
            2 Days
          </Text>
        </TouchableOpacity>

        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayFilterButton,
              activeDaysFilter === day && styles.dayFilterActive,
            ]}
            onPress={() => setActiveDaysFilter(day)}
          >
            <Text
              style={[
                styles.dayFilterText,
                activeDaysFilter === day && styles.dayFilterTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Meal Plan Grid */}
      <ScrollView
        style={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {mealTypes.map((mealType) => (
            <View key={mealType} style={styles.mealRow}>
              {/* Meal Type Label */}
              <View style={styles.mealLabelContainer}>
                <Text style={styles.mealLabel}>{mealType}</Text>
              </View>

              {/* Day Columns */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dayColumns}
              >
                {visibleDays.map((day) => {
                  const recipe = mealPlan[day]?.[mealType];

                  return (
                    <View key={`${day}-${mealType}`} style={styles.mealCard}>
                      {recipe ? (
                        <TouchableOpacity
                          style={styles.recipeCard}
                          onPress={() =>
                            handleRecipePress(day, mealType, recipe)
                          }
                        >
                          <View style={styles.recipeImagePlaceholder} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.addCard}
                          onPress={() => handleAddRecipe(day, mealType)}
                        >
                          <Ionicons name="add" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Validation Button */}
      <View style={styles.validationButtonContainer}>
        <TouchableOpacity
          style={styles.validationButton}
          onPress={handleValidation}
        >
          <Text style={styles.validationButtonText}>Validation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /** HEADER **/
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

  /** PROGRESS BARS **/
  progressContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: "#6B7280",
  },

  /** DATE SELECTOR **/
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  /** DAYS FILTER **/
  daysFilter: {
    marginBottom: 20,
  },
  daysFilterContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  dayFilterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  dayFilterActive: {
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  dayFilterText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  dayFilterTextActive: {
    color: "#111827",
    fontWeight: "600",
  },

  /** MEAL GRID **/
  gridContainer: {
    flex: 1,
  },
  grid: {
    paddingLeft: 16,
  },
  mealRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  mealLabelContainer: {
    width: 80,
    justifyContent: "center",
    paddingRight: 12,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  dayColumns: {
    gap: 12,
    paddingRight: 16,
  },
  mealCard: {
    width: 100,
  },
  recipeCard: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  recipeImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  addCard: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  /** VALIDATION BUTTON **/
  validationButtonContainer: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
  },
  validationButton: {
    backgroundColor: "#9CA3AF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  validationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MealPlanScreen;
