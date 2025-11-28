import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- Type Definitions (Assumes RootStackParamList is defined in '../navigation') ---
// NOTE: Adjust the import path for RootStackParamList as necessary
import { RootStackParamList } from '../navigation'; 

// Define the props type for this screen. Assumes the screen is named 'CreateRecipe'
type CreateRecipeScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateRecipe'>;

const { width } = Dimensions.get('window');

// --- Component ---
export default function CreateRecipeScreen({ navigation }: CreateRecipeScreenProps) {
  const [mealName, setMealName] = useState('');
  const [servings, setServings] = useState(2);
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- Handlers ---

  const handleSaveMeal = async () => {
    if (!mealName.trim() || !cookTime.trim() || !ingredients.trim() || !instructions.trim()) {
      Alert.alert('Missing Fields', 'Please fill out all required fields.');
      return;
    }

    setIsSaving(true);
    // TODO: Implement actual API call here to save the recipe data
    
    // Example Simulation:
    console.log('Saving Recipe:', { mealName, servings, cookTime, ingredients, instructions });
    
    setTimeout(() => {
        setIsSaving(false);
        Alert.alert('Success', `${mealName} saved successfully!`);
        // Navigate back to Home or to the new recipe's detail screen
        navigation.navigate('Home'); // Cast necessary if Home is defined without params
    }, 1500);
  };
  
  const handleServingsChange = (delta: number) => {
      setServings(prev => Math.max(1, prev + delta)); // Servings minimum is 1
  }

  // --- Render ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          // FIX: Navigates to the "Home" screen
          onPress={() => navigation.navigate('Home')}
          disabled={isSaving}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Sara's kitchen</Text>
          <Ionicons name="restaurant-outline" size={24} color="#C1B4DE" />
        </View>
        
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Let's create your recipes !</Text>

        {/* Name of Meal */}
        <Text style={styles.label}>Name of meal</Text>
        <TextInput
          style={styles.input}
          value={mealName}
          onChangeText={setMealName}
          placeholder="e.g., Chicken Stir Fry"
        />

        {/* Servings Counter */}
        <Text style={styles.label}>How many people are you cooking for?</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity 
            style={[styles.counterButton, servings <= 1 && styles.counterDisabled]}
            onPress={() => handleServingsChange(-1)}
            disabled={servings <= 1}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{servings}</Text>
          <TouchableOpacity 
            style={styles.counterButton}
            onPress={() => handleServingsChange(1)}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Prep and Cook Time */}
        <Text style={styles.label}>Prep and cook time?</Text>
        <TextInput
          style={styles.input}
          value={cookTime}
          onChangeText={setCookTime}
          placeholder="e.g., 45 minutes"
        />

        {/* Ingredients */}
        <Text style={styles.label}>Ingredients</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="List ingredients and quantities (e.g., 1 cup flour, 2 eggs)"
          multiline
          textAlignVertical="top"
        />

        {/* Instructions */}
        <Text style={styles.label}>Instructions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Step-by-step instructions"
          multiline
          textAlignVertical="top"
        />

        {/* Bottom spacer to keep content above the button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Meal Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveMeal}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Meal'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Styling ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /** HEADER **/
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 40,
  },
  
  /** BODY **/
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#C1B4DE',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },

  /** SERVINGS COUNTER **/
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C1B4DE',
  },
  counterDisabled: {
    opacity: 0.5,
  },
  counterButtonText: {
    fontSize: 24,
    color: '#111827',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    minWidth: 20,
    textAlign: 'center',
  },

  /** FOOTER (BUTTON) **/
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#C1B4DE', // The lilac/purple color from the image
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});