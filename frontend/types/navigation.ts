export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
  CreateMeal: undefined; // The FAB screen target (MealPrepSetupScreen)
  Search: undefined;
  Profile: undefined;

  
  SelectRecipes: {
    numberOfDays: number;
    selectedDays: string[];
    selectedRecipeOption: string;
  };
  CategoryRecipes: {
    category: string;
    day?: string;
    returnTo?: string;
  }; // Screen for Image 1 ("Lunch" screen), takes a 'category' parameter
  MealPlan: {
    numberOfDays: number;
    selectedDays: string[];
    selectedRecipeOption?: string;
    selectedRecipes: any[];
    planId?: string; 
  }; // Meal plan screen

  AIChat: undefined; // New screen for AI chat interactions
};


/**
 * Defines the parameters list for the main Bottom Tab Navigator.
 * All screen components will use these names in their props.
 */
// export type RootTabParamList = {
//     Home: undefined;
//     Favorites: undefined;
//     CreateMeal: undefined; // The FAB screen target (MealPrepSetupScreen)
//     Search: undefined;
//     Profile: undefined;
    
//     // --- Meal Prep Flow Screens ---
//     SelectRecipes: { planId: string }; // Requires planId
//     CategoryRecipes: { category: string; planId: string }; // Requires category and planId
//     AIChat: { planId: string }; // Requires planId
// };