import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

// --- Define Screen Prop Type ---
type SelectRecipesScreenProps = BottomTabScreenProps<RootTabParamList, 'SelectRecipes'>;

// --- Reusable Component Mocks (Use your RN Reusables components here) ---

const RNCard: React.FC<{ style?: object | object[]; children: React.ReactNode }> = ({ style, children }) => (
  <View style={[{ borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 }, style]}>
    {children}
  </View>
);

interface RecipeListItemProps {
  title: string;
  time: string;
  onAddPress: () => void;
}

const RecipeListItem: React.FC<RecipeListItemProps> = ({ title, time, onAddPress }) => (
  <RNCard style={styles.recipeListItemCard}>
    <View style={styles.recipeListItemImagePlaceholder} />
    <View style={styles.recipeListItemDetails}>
      <Text style={styles.recipeListItemTitle}>{title}</Text>
      <View style={styles.recipeListItemTimeRow}>
        <MaterialCommunityIcons name="clock-outline" size={14} color="#555" />
        <Text style={styles.recipeListItemTimeText}>{time}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.recipeListItemAddButton} onPress={onAddPress}>
      <Ionicons name="add" size={20} color="#000" />
    </TouchableOpacity>
  </RNCard>
);

// --- Component Data ---
const recipesData = [
  { id: '1', category: 'Breakfast', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes' },
  { id: '2', category: 'Breakfast', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes' },
  { id: '3', category: 'Breakfast', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes' },
  { id: '4', category: 'Lunch', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes' },
  { id: '5', category: 'Lunch', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes' },
  { id: '6', category: 'Lunch', title: 'Lorem ipsum dolor sit amet', time: '30-45 minutes' },
];

// --- Main Screen Component ---
const SelectRecipesScreen: React.FC<SelectRecipesScreenProps> = ({ navigation }) => {

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Sara's kitchen</Text>
        <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#000" style={styles.iconStyle} />
      </View>
      <View style={styles.rightHeaderBox} />
    </View>
  );

  const renderRecipeSection = (category: string) => (
    <View key={category} style={styles.categorySection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{category}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CategoryRecipes', { category })}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
        {recipesData
          .filter(recipe => recipe.category === category)
          .map(recipe => (
            <RecipeListItem
              key={recipe.id}
              title={recipe.title}
              time={recipe.time}
              onAddPress={() => console.log(`Add ${recipe.title}`)}
            />
          ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header />

        {/* Progress Dots/Placeholder Lines */}
        <View style={styles.progressContainer}>
            {Array(5).fill(0).map((_, i) => (
                <View key={i} style={[styles.progressDot, i === 1 && styles.progressDotActive]} /> //* Second dot active */}
            ))}
        </View>

        <Text style={styles.mainHeading}>Select your receipes you want to add :</Text>

        {renderRecipeSection('Breakfast')}
        {renderRecipeSection('Lunch')}
        {/* Add more categories here if needed */}

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} /> {/* Space for FAB */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  // Header Styles (Adapted from previous screens)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow title to take up space
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  iconStyle: {},
  rightHeaderBox: {
    width: 30,
    height: 30,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginLeft: 10,
  },

  // Progress Dots
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 25,
  },
  progressDot: {
    width: '18%',
    height: 3,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginRight: '2%',
  },
  progressDotActive: {
    backgroundColor: '#000',
  },

  mainHeading: {
    fontSize: 22, // Slightly smaller than previous main heading
    fontWeight: 'bold',
    marginBottom: 30,
  },

  categorySection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#888',
  },
  horizontalScrollContainer: {
    paddingRight: 15, // Ensure last item isn't cut off
  },

  // Recipe List Item within horizontal scroll (Image 2 cards)
  recipeListItemCard: {
    width: width * 0.4, // Approx width to show 2.5 cards
    marginRight: 15,
    padding: 10,
  },
  recipeListItemImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeListItemDetails: {
    flex: 1,
  },
  recipeListItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeListItemTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeListItemTimeText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  recipeListItemAddButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  // Next Button
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 15, // For consistency, though should be full width if no padding
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelectRecipesScreen;