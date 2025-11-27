import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';


// --- Define Screen Prop Type ---
type CategoryRecipesScreenProps = BottomTabScreenProps<RootTabParamList, 'CategoryRecipes'>;

// --- Reusable Component Mocks (Use your RN Reusables components here) ---

const RNCard: React.FC<{ style?: object | object[]; children: React.ReactNode }> = ({ style, children }) => (
  <View style={[{ borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 }, style]}>
    {children}
  </View>
);

interface FullRecipeListItemProps {
  title: string;
  onAddPress: () => void;
}

const FullRecipeListItem: React.FC<FullRecipeListItemProps> = ({ title, onAddPress }) => (
  <RNCard style={styles.fullRecipeListItemCard}>
    <View style={styles.fullRecipeListItemImagePlaceholder} />
    <View style={styles.fullRecipeListItemDetails}>
      <Text style={styles.fullRecipeListItemTitle}>{title}</Text>
    </View>
    <TouchableOpacity style={styles.fullRecipeListItemAddButton} onPress={onAddPress}>
      <Ionicons name="add" size={20} color="#000" />
    </TouchableOpacity>
  </RNCard>
);

// --- Component Data ---
const specificCategoryRecipes = [
  { id: 'a', title: 'Lorem ipsum dolor sit amet' },
  { id: 'b', title: 'Lorem ipsum dolor sit amet' },
  { id: 'c', title: 'Lorem ipsum dolor sit amet' },
  { id: 'd', title: 'Lorem ipsum dolor sit amet' },
  { id: 'e', title: 'Lorem ipsum dolor sit amet' },
];

// --- Main Screen Component ---
const CategoryRecipesScreen: React.FC<CategoryRecipesScreenProps> = ({ navigation, route }) => {
  const { category } = route.params; // Get the category from navigation params

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header />

        {/* Progress Dots/Placeholder Lines */}
        <View style={styles.progressContainer}>
            {Array(5).fill(0).map((_, i) => (
                <View key={i} style={[styles.progressDot, i === 2 && styles.progressDotActive]} /> //* Third dot active for this example */}
            ))}
        </View>

        <Text style={styles.categoryTitle}>{category}</Text>

        {specificCategoryRecipes.map(recipe => (
          <FullRecipeListItem
            key={recipe.id}
            title={recipe.title}
            onAddPress={() => console.log(`Added ${recipe.title} from ${category}`)}
          />
        ))}

        {/* Validation Button (Bottom overlay) */}
        <View style={{height: 80}} /> {/* Spacer to prevent content from being hidden by overlay */}
      </ScrollView>

      {/* Fixed Validation Button at the bottom */}
      <View style={styles.validationButtonContainer}>
          <TouchableOpacity style={styles.validationButton}>
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
  container: {
    paddingHorizontal: 15,
    paddingBottom: 20,
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
    flex: 1,
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

  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // Full Recipe List Item (Image 1 cards)
  fullRecipeListItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
  },
  fullRecipeListItemImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 15,
  },
  fullRecipeListItemDetails: {
    flex: 1,
  },
  fullRecipeListItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullRecipeListItemAddButton: {
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

  // Validation Button (Fixed at bottom)
  validationButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255,0.95)', // Semi-transparent white overlay
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
      paddingBottom: 30, // For safe area padding
  },
  validationButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  validationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoryRecipesScreen;