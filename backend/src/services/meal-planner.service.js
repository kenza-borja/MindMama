import * as plansDb from "../db/plans.db.js";
import * as recipesDb from "../db/recipes.db.js";
import { aiClient } from "../config/orchestrator.js";

export async function createPlan({ startDate, days }) {
  return plansDb.createPlan({ startDate, days });
}

export async function getPlan(planId) {
  return plansDb.getPlan(planId);
}

export async function addMealFromSaved({ planId, date, label, recipeId }) {
  return plansDb.addMeal(planId, date, { label, recipeId });
}

export async function addMealFromAi({ planId, date, label, preferences }) {
  const { data } = await aiClient.post("/ai/suggest-meal", preferences);

  const recipeDraft = data.recipe || data;

  const recipeId = await recipesDb.createRecipe({
    ...recipeDraft,
    source: "ai"
  });

  return plansDb.addMeal(planId, date, { label, recipeId });
}
