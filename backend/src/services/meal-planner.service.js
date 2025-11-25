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
  const body = {
    meal_type: preferences?.meal_type || label.toLowerCase(),         
    num_people: preferences?.num_people ?? 2,
    time_available:
      preferences?.time_available ?? preferences?.time_limit_minutes ?? 30,
    dietary_restrictions:
      preferences?.dietary_restrictions ?? preferences?.dietary_preferences ?? [],
    preferences: preferences?.preferences_text ?? preferences?.notes ?? "",
  };

  const { data } = await aiClient.post("/ai/suggest-meal", body);


  const recipeDraft = data;

  const recipeId = await recipesDb.createRecipe({
    title: recipeDraft.title,
    ingredients: recipeDraft.ingredients,
    steps: recipeDraft.steps,
    prep_time: recipeDraft.prep_time,
    cook_time: recipeDraft.cook_time,
    source: "ai",
  });

  return plansDb.addMeal(planId, date, { label, recipeId });
}
