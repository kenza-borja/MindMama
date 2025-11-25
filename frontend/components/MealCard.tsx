// components/MealCard.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

interface MealCardProps {
  day: string;
  date: string;
  month: string;
  meal: string;
  selected: boolean;
  onPress?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ 
  day, 
  date, 
  month, 
  meal, 
  selected, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.mealCard, 
        selected && styles.mealCardSelected
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Day (Mon, Tue, etc.) */}
      <Text style={[
        styles.mealDay, 
        selected && styles.mealDaySelected
      ]}>
        {day}
      </Text>
      
      {/* Date (17 Nov) */}
      <Text style={[
        styles.mealDate, 
        selected && styles.mealDateSelected
      ]}>
        {date} {month}
      </Text>
      
      {/* Meal Type (Breakfast, Lunch, Dinner) */}
      <Text style={styles.mealType}>{meal}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mealCard: {
    width: width * 0.22,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mealCardSelected: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealDay: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  mealDaySelected: {
    color: '#6B7280',
    fontWeight: '600',
  },
  mealDate: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  mealDateSelected: {
    color: '#111827',
    fontWeight: '600',
  },
  mealType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
});