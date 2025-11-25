// screens/HomeScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';


import { PillButton } from '../components/PillButton';
import { RecipeCard } from '../components/RecipeCard';
import { MealCard } from '../components/MealCard';

const { width } = Dimensions.get('window');

// Mock data
const mealOfTheDayData = [
  { day: 'Mon', date: '17', month: 'Nov', meal: 'Breakfast', selected: false },
  { day: 'Tue', date: '18', month: 'Nov', meal: 'Breakfast', selected: true },
  { day: 'Wed', date: '19', month: 'Nov', meal: 'Lunch', selected: false },
  { day: 'Thu', date: '20', month: 'Nov', meal: 'Dinner', selected: false },
  { day: 'Fri', date: '21', month: 'Nov', meal: 'Dinner', selected: false },
];

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Deserts', 'Snacks'];

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Sara's kitchen</Text>
              <MaterialCommunityIcons 
                name="silverware-fork-knife" 
                size={24} 
                color="#000" 
              />
            </View>
            <Text style={styles.subtitleText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.searchIcon}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.rightHeaderBox} />
          </View>
        </View>

        {/* Meal of the Day Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>MEAL OF THE DAY</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.horizontalScroll}
        >
          {mealOfTheDayData.map((item, index) => (
            <MealCard key={index} {...item} />
          ))}
        </ScrollView>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CATEGORIES</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.horizontalScroll}
        >
          {categories.map((category, index) => (
            <PillButton
              key={index}
              label={category}
              selected={index === 0}
            />
          ))}
        </ScrollView>

        {/* Last Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>LAST RECIPES</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <RecipeCard
          title="Lorem Ipsum Dolor"
          large={true}
          details={{ rating: 5, time: '20 min' }}
        />

        {/* Favorites Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>FAVORITES</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <RecipeCard title="Recipe 1" large={false} />
          <RecipeCard title="Recipe 2" large={false} />
          <RecipeCard title="Recipe 3" large={false} />
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchIcon: {
    padding: 4,
  },
  rightHeaderBox: {
    width: 40,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  viewAllText: {
    fontSize: 14,
    color: '#888',
  },
  horizontalScroll: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
});

export default HomeScreen;