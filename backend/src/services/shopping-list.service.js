import * as plansDb from "../db/plans.db.js";
import * as recipesDb from "../db/recipes.db.js";
import { aiClient } from "../config/orchestrator.js";

export async function generateList(planId) {
  const plan = await plansDb.getPlan(planId);
  if (!plan) throw new Error("Plan not found");

  const recipeIds = [];
  for (const day of plan.days) {
    for (const meal of day.meals) {
      if (meal.recipeId) recipeIds.push(meal.recipeId);
    }
  }

  const recipes = Object.values(await recipesDb.getRecipesByIds(recipeIds));

  const { data } = await aiClient.post("/ai/generate-shopping-list", {
    recipes
  });

  return data;
}
