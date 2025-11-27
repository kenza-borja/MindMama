import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// import * as shape from 'react-native-redash/lib/module/v1/Paths'; // Placeholder for complex curve logic

const { width } = Dimensions.get('window');

// List of icon names for the four regular tabs

const tabIcons = ['home-outline', 'heart-outline', 'search-outline', 'person-outline'] as const;

// Mocking the Custom Tab Bar
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

 

  // Custom FAB component logic
  const FabButton = () => (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('CreateMeal' as never)} // Navigating to the Tab Name
    >
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );
  



  return (
    <View style={styles.tabBarContainer}>
      
      {/* MOCK: This view acts as the white, slightly lifted base of the tab bar */}
      <View style={styles.tabBarBackground} />

      {/* Regular Tab Items */}
      <View style={styles.tabsRow}>
        {state.routes
          .filter((route) => {
            // Filter out routes that should be hidden from the tab bar
            const { options } = descriptors[route.key];
            return options.tabBarButton === undefined;
          })
          .map((route, index) => {
            const { options } = descriptors[route.key];
            const originalIndex = state.routes.findIndex(r => r.key === route.key);
            const isFocused = state.index === originalIndex;
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

           

            // Get the icon name directly from the array using the filtered index
            const iconName = tabIcons[index]; 
            

            // Safety check: if iconName is undefined, skip this route
            if (!iconName) {
              return null;
            }

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // The navigation object's type ensures we can navigate to valid tab names
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                // Cast options to 'any' to suppress the error on the non-essential prop
                testID={(options as any).tabBarTestID} 
                onPress={onPress}
                style={styles.tabItem}
              >
                <Ionicons
                  name={isFocused ? iconName.replace('-outline', '') as keyof typeof Ionicons.glyphMap : iconName as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={isFocused ? '#000' : '#888'}
                />
                {/* Optional: Add text labels here if needed */}
                {/* <Text style={{ color: isFocused ? '#000' : '#888', fontSize: 10 }}>{label as string}</Text> */}
              </TouchableOpacity>
            );
          })}
      </View>
      
      {/* FAB rendered over the tab bar */}
      <View style={styles.fabWrapper}>
          <FabButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: "#E5E7EB",
    alignItems: 'center',
    paddingBottom: 20, // Padding for safe area/aesthetic spacing
  },
  tabBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60, // Height of the bar itself
    backgroundColor: "#E5E7EB",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Shadow to lift the bar slightly off the screen bottom (as seen in the mockup)
    
    elevation: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabItemPlaceholder: {
    width: width / 5, // Approximate width for the FAB's space
    height: '100%',
  },

  // Floating Action Button (FAB) styles
  fabWrapper: {
    position: 'absolute',
    top: -45, // Position the FAB above the tab bar background
    alignSelf: 'center',
    width: width / 5, // Ensure the FAB is centered in its slot
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB", // Black background
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
     
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
    fontWeight: '500',
  },
});

export default CustomTabBar;