import * as recipesDb from "../db/recipes.db.js";
import { aiClient } from "../config/orchestrator.js";

export async function listRecipes() {
  return recipesDb.listRecipes();
}

export async function createManualRecipe(recipe) {
  return recipesDb.createRecipe({ ...recipe, source: "manual" });
}

export async function extractRecipe(rawText) {
  const { data } = await aiClient.post("/ai/extract-recipe", { raw_text: rawText });

  const recipeDraft = data.recipe || data;

  return recipesDb.createRecipe({ ...recipeDraft, source: "paste" });
}
