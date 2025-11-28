// screens/SelectRecipesScreen.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';

type SelectRecipesScreenProps = BottomTabScreenProps<RootTabParamList, 'SelectRecipes'>;

interface Recipe {
  id: string;
  title: string;
  time: string;
  imageUrl?: string;
  added: boolean;
}

// Mock data
const recipesData = {
  Breakfast: [
    { id: '1', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
    { id: '2', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
    { id: '3', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
  ],
  Lunch: [
    { id: '4', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
    { id: '5', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
    { id: '6', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
  ],
  Dinner: [
    { id: '7', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
    { id: '8', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
  ],
  Desserts: [
    { id: '7', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
    { id: '8', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
  ],
  Snacks: [
    { id: '7', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
    { id: '8', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes', added: false },
  ],
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cards per row with padding

const SelectRecipesScreen: React.FC<SelectRecipesScreenProps> = ({ navigation, route }) => {
  const { numberOfDays = 2, selectedDays = [], selectedRecipeOption = 'New recipe' } = route.params || {};
  const [recipes, setRecipes] = useState(recipesData);

  const handleAddRecipe = (category: string, recipeId: string) => {
    setRecipes(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].map(recipe =>
        recipe.id === recipeId ? { ...recipe, added: !recipe.added } : recipe
      ),
    }));
  };

  const handleSeeAll = (category: string) => {
    navigation.navigate('CategoryRecipes', { category });
  };

  const handleNext = () => {
    // Get all selected recipes
    const allSelectedRecipes = Object.entries(recipes).flatMap(([category, recipeList]) =>
      recipeList.filter(r => r.added).map(r => ({ ...r, category }))
    );
    
    console.log('Selected recipes:', allSelectedRecipes);
    
    // Navigate to CategoryRecipes screen (you can choose which category to show)
    // Option 1: Navigate to a specific category (e.g., Lunch)
    navigation.navigate('CategoryRecipes', { category: 'Lunch' });
    
    // Option 2: Navigate to next step instead
    // navigation.navigate('NextStep', { selectedRecipes: allSelectedRecipes });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('CreateMeal')}
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
        <View style={styles.progressBar} />
        <View style={styles.progressBar} />
        <View style={styles.progressBar} />
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>Select your receipes you want to add :</Text>

        {/* Breakfast Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Breakfast</Text>
            <TouchableOpacity onPress={() => handleSeeAll('Breakfast')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesRow}
          >
            {recipes.Breakfast.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeImageContainer}>
                  <View style={styles.recipeImagePlaceholder} />
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddRecipe('Breakfast', recipe.id)}
                  >
                    <Ionicons 
                      name={recipe.added ? "checkmark" : "add"} 
                      size={20} 
                      color={recipe.added ? "#10B981" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {recipe.title}
                </Text>
                <View style={styles.recipeTimeContainer}>
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.recipeTime}>{recipe.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Lunch Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Lunch</Text>
            <TouchableOpacity onPress={() => handleSeeAll('Lunch')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesRow}
          >
            {recipes.Lunch.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeImageContainer}>
                  <View style={styles.recipeImagePlaceholder} />
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddRecipe('Lunch', recipe.id)}
                  >
                    <Ionicons 
                      name={recipe.added ? "checkmark" : "add"} 
                      size={20} 
                      color={recipe.added ? "#10B981" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {recipe.title}
                </Text>
                <View style={styles.recipeTimeContainer}>
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.recipeTime}>{recipe.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Dinner Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Dinner</Text>
            <TouchableOpacity onPress={() => handleSeeAll('Dinner')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesRow}
          >
            {recipes.Dinner.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeImageContainer}>
                  <View style={styles.recipeImagePlaceholder} />
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddRecipe('Dinner', recipe.id)}
                  >
                    <Ionicons 
                      name={recipe.added ? "checkmark" : "add"} 
                      size={20} 
                      color={recipe.added ? "#10B981" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {recipe.title}
                </Text>
                <View style={styles.recipeTimeContainer}>
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.recipeTime}>{recipe.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

            {/* Desserts Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Desserts</Text>
            <TouchableOpacity onPress={() => handleSeeAll('Desserts')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesRow}
          >
            {recipes.Dinner.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeImageContainer}>
                  <View style={styles.recipeImagePlaceholder} />
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddRecipe('Desserts', recipe.id)}
                  >
                    <Ionicons 
                      name={recipe.added ? "checkmark" : "add"} 
                      size={20} 
                      color={recipe.added ? "#10B981" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {recipe.title}
                </Text>
                <View style={styles.recipeTimeContainer}>
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.recipeTime}>{recipe.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Snacks Section */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Snacks</Text>
            <TouchableOpacity onPress={() => handleSeeAll('Snacks')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesRow}
          >
            {recipes.Dinner.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeImageContainer}>
                  <View style={styles.recipeImagePlaceholder} />
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddRecipe('Snacks', recipe.id)}
                  >
                    <Ionicons 
                      name={recipe.added ? "checkmark" : "add"} 
                      size={20} 
                      color={recipe.added ? "#10B981" : "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {recipe.title}
                </Text>
                <View style={styles.recipeTimeContainer}>
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.recipeTime}>{recipe.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
};

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

  /** PROGRESS BARS **/
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: '#6B7280',
  },

  /** BODY **/
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 20,
  },

  /** CATEGORY SECTIONS **/
  categorySection: {
    marginBottom: 28,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  /** RECIPES ROW **/
  recipesRow: {
    paddingRight: 16,
  },
  recipeCard: {
    width: CARD_WIDTH,
    marginRight: 12,
  },
  recipeImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  recipeImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 18,
  },
  recipeTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  /** NEXT BUTTON **/
  nextButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
  },
  nextButton: {
    backgroundColor: '#9CA3AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  
});

export default SelectRecipesScreen;