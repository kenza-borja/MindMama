export type RootStackParamList = {
  Home: { refresh?: boolean; planId?: string } | undefined;
  CreatePlan: undefined;
  AIGenerate: { planId: string; date: string; label: string };
  AISuggestion: {
    plan: any;
    planId: string;
    date: string;
    label: string;
  };
  SelectRecipes: {
    numberOfDays: number;
    selectedDays: string[];
    selectedRecipeOption: string;
  };
  CategoryRecipes: {
    category: string;
    day?: string;
    returnTo?: string;
  };
  MealPlan: {
    numberOfDays: number;
    selectedDays: string[];
    selectedRecipeOption?: string;
    selectedRecipes: any[];
    planId?: string;
  };
  AIChat: undefined;
  ShoppingList: { planId?: string } | undefined;
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