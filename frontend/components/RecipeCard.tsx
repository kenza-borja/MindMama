import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Image 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface RecipeCardProps {
  title: string;
  large: boolean;
  details?: { 
    rating: number; 
    time: string;
  };
  imageUrl?: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  title, 
  large, 
  details, 
  imageUrl,
  isFavorite = false,
  onPress,
  onFavoritePress 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.cardBase, 
        large ? styles.largeCard : styles.smallCard
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Heart Icon */}
      <TouchableOpacity 
        style={styles.heartIconContainer}
        onPress={onFavoritePress}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={20} 
          color={isFavorite ? "#FF6B6B" : "#6B7280"} 
        />
      </TouchableOpacity>
      
      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.recipeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContent}>
            <Ionicons name="image-outline" size={40} color="#D1D5DB" />
          </View>
        )}
      </View>

      {/* Card Details (only for large cards) */}
      {large && (
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>
          {details && (
            <View style={styles.detailsRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text style={styles.detailText}>{details.rating}</Text>
              </View>
              <View style={styles.timeContainer}>
                <MaterialCommunityIcons 
                  name="clock-outline" 
                  size={14} 
                  color="#6B7280" 
                />
                <Text style={styles.detailText}>{details.time}</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  largeCard: {
    width: '100%',
    height: 240,
    marginBottom: 16,
  },
  smallCard: {
    width: width * 0.42,
    height: 180,
    marginRight: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: '70%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDetails: {
    padding: 12,
    height: '30%',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
});