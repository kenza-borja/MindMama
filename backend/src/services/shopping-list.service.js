import * as plansDb from "../db/plans.db.js";
import * as recipesDb from "../db/recipes.db.js";

function inferIngredientNameFromLine(line) {
  if (!line || typeof line !== "string") return "unknown";

  const cleaned = line
    .toLowerCase()
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleaned.split(" ");
  if (parts.length === 0) return "unknown";

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

      if (!itemsByName.has(name)) {
        itemsByName.set(name, {
          name,
          lines: [],
        });
      }

      itemsByName.get(name).lines.push(line);
    }
  }

  // 5) Return aggregated list
  const items = Array.from(itemsByName.values());

  return {
    planId,
    items,
  };
}
