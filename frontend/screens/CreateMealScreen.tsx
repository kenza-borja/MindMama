// screens/CreateMealScreen.tsx
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface CreateMealScreenProps {
  navigation: any;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const recipeOptions = ["New recipe", "Save", "Suggestion from AI"];

const CreateMealScreen: React.FC<CreateMealScreenProps> = ({ navigation }) => {
  const [numberOfDays, setNumberOfDays] = useState(2);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday"]);
  const [selectedRecipeOption, setSelectedRecipeOption] =
    useState("New recipe");

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleIncrement = () => {
    if (numberOfDays < 7) {
      setNumberOfDays(numberOfDays + 1);
    }
  };

  const handleDecrement = () => {
    if (numberOfDays > 1) {
      setNumberOfDays(numberOfDays - 1);
    }
  };

  const handleNext = () => {
  navigation.navigate('SelectRecipes', {
    numberOfDays,
    selectedDays,
    selectedRecipeOption,
  });
};

  return (
    <SafeAreaView style={styles.safeArea}>
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

        {/* Empty view for layout balance */}
        <View style={styles.headerRight} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.progressActive]} />
        <View style={styles.progressBar} />
        <View style={styles.progressBar} />
        <View style={styles.progressBar} />
        <View style={styles.progressBar} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main Title */}
        <Text style={styles.mainTitle}>Let's create your meals !</Text>

        {/* How many days? */}
        <View style={styles.card}>
          <Text style={styles.questionText}>How many days ?</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={handleDecrement}
            >
              <Ionicons name="remove" size={24} color="#6B7280" />
            </TouchableOpacity>

            <Text style={styles.counterValue}>{numberOfDays}</Text>

            <TouchableOpacity
              style={styles.counterButton}
              onPress={handleIncrement}
            >
              <Ionicons name="add" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Which days? */}
        <View style={styles.card}>
          <Text style={styles.questionText}>Which days ?</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.dayButtonSelected,
                ]}
                onPress={() => handleDayToggle(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day) && styles.dayTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Where do you want take your recipe? */}
        <View style={styles.card}>
          <Text style={styles.questionText}>
            Where do you want take your receipe ?
          </Text>
          <View style={styles.optionsContainer}>
            {recipeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedRecipeOption === option &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedRecipeOption(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedRecipeOption === option &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NEXT BUTTON */}
        <View style={styles.nextButtonWrapper}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>
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
    marginBottom: 24,
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

  /** BODY **/
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    color: "#111827",
  },

  /** CARDS **/
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },

  /** COUNTER **/
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  counterValue: {
    fontSize: 32,
    fontWeight: "600",
    color: "#111827",
  },

  /** DAYS + OPTIONS CHIPS **/
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },
  dayButtonSelected: {
    backgroundColor: "#E5E7EB",
    borderColor: "#D1D5DB",
  },
  dayText: {
    fontSize: 14,
    color: "#6B7280",
  },
  dayTextSelected: {
    color: "#111827",
    fontWeight: "600",
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },
  optionButtonSelected: {
    backgroundColor: "#E5E7EB",
    borderColor: "#D1D5DB",
  },
  optionText: {
    fontSize: 14,
    color: "#6B7280",
  },
  optionTextSelected: {
    color: "#111827",
    fontWeight: "600",
  },

  /** NEXT BUTTON **/
  nextButtonWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: "#9CA3AF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateMealScreen;
