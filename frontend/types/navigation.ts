/**
 * Defines the parameters list for the main Bottom Tab Navigator.
 * All screen components will use these names in their props.
 */
export type RootTabParamList = {
    Home: undefined;
    Favorites: undefined;
    CreateMeal: undefined; // The FAB screen target (MealPrepSetupScreen)
    Search: undefined;
    Profile: undefined;
    
    // --- NEW SCREENS ---
    SelectRecipes: { numberOfDays: number; selectedDays: string[]; selectedRecipeOption: string }; // Screen for Image 2 ("Select your recipes you want to add")
    CategoryRecipes: { category: string }; // Screen for Image 1 ("Lunch" screen), takes a 'category' parameter
};