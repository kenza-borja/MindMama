import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PillButtonProps {
  label: string;
  selected: boolean;
  onPress?: () => void;
}

export const PillButton: React.FC<PillButtonProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.pillButton, selected ? styles.pillSelected : styles.pillDefault]}
    onPress={onPress}
  >
    <Text style={[styles.pillText, selected ? styles.pillTextSelected : styles.pillTextDefault]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  pillButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  pillDefault: {
    backgroundColor: '#F3F4F6',
  },
  pillSelected: {
    backgroundColor: '#000',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pillTextDefault: {
    color: '#555',
  },
  pillTextSelected: {
    color: '#fff',
  },
});