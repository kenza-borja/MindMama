import * as plansDb from "../db/plans.db.js";
import * as recipesDb from "../db/recipes.db.js";

const CATEGORY_KEYWORDS = {
  "Meat & Poultry": [
    "chicken", "beef", "lamb", "mutton", "turkey", "duck", "veal",
    "mince", "minced", "steak", "sausage", "bacon", "pork", "meat", "kofta",
  ],
  "Fish & Seafood": [
    "fish", "salmon", "tuna", "shrimp", "prawn", "cod", "tilapia",
    "sardine", "anchovy", "squid", "seafood",
  ],
  "Vegetables": [
    "onion", "garlic", "tomato", "carrot", "potato", "pepper", "capsicum",
    "courgette", "zucchini", "broccoli", "spinach", "lettuce", "cucumber",
    "celery", "aubergine", "eggplant", "pea", "corn", "cabbage", "cauliflower",
    "mushroom", "leek", "kale", "chard", "radish", "turnip", "parsnip",
    "artichoke", "asparagus", "beetroot", "pumpkin", "squash",
  ],
  "Fruit": [
    "lemon", "lime", "orange", "apple", "banana", "mango", "date",
    "apricot", "fig", "grape", "pomegranate", "avocado", "tomato",
  ],
  "Dairy & Eggs": [
    "milk", "cream", "butter", "cheese", "yogurt", "yoghurt",
    "egg", "eggs", "ghee", "kefir",
  ],
  "Grains & Carbs": [
    "rice", "pasta", "bread", "flour", "couscous", "quinoa", "oat",
    "noodle", "pita", "bulgur", "semolina", "barley", "polenta",
  ],
  "Legumes": [
    "lentil", "lentils", "chickpea", "chickpeas", "bean", "beans",
    "pea", "peas", "lentil", "fava", "edamame",
  ],
  "Spices & Herbs": [
    "cumin", "turmeric", "coriander", "cinnamon", "paprika", "ginger",
    "oregano", "thyme", "basil", "parsley", "mint", "saffron", "cardamom",
    "clove", "nutmeg", "chilli", "chili", "pepper", "allspice", "bay",
    "sumac", "za'atar", "ras el hanout", "harissa",
  ],
  "Pantry": [
    "oil", "olive", "salt", "sugar", "honey", "vinegar", "stock", "broth",
    "sauce", "paste", "soy", "coconut", "tomato paste", "tahini",
    "condensed", "evaporated", "vanilla", "baking", "yeast",
  ],
};

function inferCategory(line) {
  if (!line || typeof line !== "string") return "Other";
  const lower = line.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return category;
  }
  return "Other";
}

function inferIngredientNameFromLine(line) {
  if (!line || typeof line !== "string") return "unknown";

  const cleaned = line
    .toLowerCase()
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleaned.split(" ");
  if (parts.length === 0) return "unknown";

  // Skip leading numbers and units, take the first meaningful word
  const units = new Set(["g", "kg", "ml", "l", "cup", "cups", "tbsp", "tsp", "oz", "lb", "clove", "cloves", "pinch", "handful", "bunch"]);
  for (const part of parts) {
    if (!isNaN(Number(part)) || units.has(part)) continue;
    return part;
  }
  return parts[parts.length - 1];
}

/**
 * Extracts ingredient lines from a recipe.
 * Supports both:
 * - ingredients: [ "2 tomatoes", "1 onion" ]
 * - ingredients: [ { text: "2 tomatoes", ... }, ... ]
 */
function getIngredientLinesFromRecipe(recipe) {
  if (!recipe || !Array.isArray(recipe.ingredients)) return [];

  return recipe.ingredients
    .map((ing) => {
      if (typeof ing === "string") return ing;
      if (ing && typeof ing === "object") {
        return ing.text || ing.name || "";
      }
      return "";
    })
    .filter((line) => line && line.trim().length > 0);
}

/**
 * Generate a simple aggregated shopping list for a plan.
 * group by ingredient "name" and attach all lines.
 */
export async function generateShoppingList(planId) {
  // 1) Load the plan
  const plan = await plansDb.getPlan(planId);
  if (!plan) {
    const err = new Error("Plan not found");
    err.status = 404;
    throw err;
  }

  // 2) Collect recipeIds from all days/meals
  const recipeIdSet = new Set();

  for (const day of plan.days || []) {
    for (const meal of day.meals || []) {
      if (typeof meal === "string") {
        // bare labels like "Lunch" (no recipe yet) -> skip
        continue;
      }
      if (meal && meal.recipeId) {
        recipeIdSet.add(meal.recipeId);
      }
    }
  }

  const recipeIds = Array.from(recipeIdSet);
  if (recipeIds.length === 0) {
    // no recipes attached -> empty shopping list
    return {
      planId,
      items: [],
    };
  }

  // 3) Load all recipes by ids
  const recipes = await recipesDb.getRecipesByIds(recipeIds);

  // 4) Build aggregation
  const itemsByName = new Map();

  for (const recipe of recipes) {
    const ingredientLines = getIngredientLinesFromRecipe(recipe);

    for (const line of ingredientLines) {
      const name = inferIngredientNameFromLine(line);
      const category = inferCategory(line);

      if (!itemsByName.has(name)) {
        itemsByName.set(name, { name, category, lines: [] });
      }

      itemsByName.get(name).lines.push(line);
    }
  }

  // 5) Return aggregated list — use the most-seen line as the display label
  const items = Array.from(itemsByName.values()).map(({ name, category, lines }) => ({
    name,
    category,
    quantity: lines.length > 1 ? lines.length : undefined,
    unit: undefined,
    lines,
  }));

  return { planId, items };
}
