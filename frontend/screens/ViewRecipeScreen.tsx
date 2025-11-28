import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ViewRecipeScreenProps {
  navigation: any;
  route: any;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  added: boolean;
}

// Mock data - replace with actual data from backend
const mockRecipes: Recipe[] = [
  { id: '1', title: 'Lorem ipsum dolor', description: 'sit amet', added: false },
  { id: '2', title: 'Lorem ipsum dolor', description: 'sit amet', added: false },
  { id: '3', title: 'Lorem ipsum dolor', description: 'sit amet', added: false },
  { id: '4', title: 'Lorem ipsum dolor', description: 'sit amet', added: false },
  { id: '5', title: 'Lorem ipsum dolor', description: 'sit amet', added: false },
  { id: '6', title: 'Lorem ipsum dolor', description: 'sit amet', added: false },
];

const ViewRecipeScreen: React.FC<ViewRecipeScreenProps> = ({ navigation, route }) => {
  const category = route?.params?.category || 'Lunch';
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);

  const handleToggleRecipe = (recipeId: string) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === recipeId ? { ...recipe, added: !recipe.added } : recipe
      )
    );
  };

  const handleValidation = () => {
    const selectedRecipes = recipes.filter(r => r.added);
    console.log('Selected recipes:', selectedRecipes);
    // Navigate back or to next step
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('SelectRecipes')}
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

      {/* Category Title */}
      <View style={styles.categoryTitleContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recipe List */}
        {recipes.map((recipe, index) => (
          <View 
            key={recipe.id} 
            style={[
              styles.recipeItem,
              index === recipes.length - 1 && styles.lastRecipeItem
            ]}
          >
            <View style={styles.recipeImagePlaceholder} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleToggleRecipe(recipe.id)}
            >
              <Ionicons 
                name={recipe.added ? "checkmark" : "add"} 
                size={20} 
                color={recipe.added ? "#10B981" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* Bottom spacing for button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Validation Button */}
      <View style={styles.validationButtonContainer}>
        <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
          <Text style={styles.validationButtonText}>Validation</Text>
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

  /** CATEGORY TITLE **/
  categoryTitleContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  /** BODY **/
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },

  /** RECIPE ITEMS **/
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastRecipeItem: {
    borderBottomWidth: 0,
  },
  recipeImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginRight: 16,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  /** VALIDATION BUTTON **/
  validationButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
  },
  validationButton: {
    backgroundColor: '#9CA3AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  validationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  
});

export default ViewRecipeScreen;