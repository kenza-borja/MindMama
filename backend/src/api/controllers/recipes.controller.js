import * as recipeService from "../../services/recipe.service.js";

export async function listRecipes(req, res, next) {
  try {
    const list = await recipeService.listRecipes();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function createManual(req, res, next) {
  try {
    const id = await recipeService.createManualRecipe(req.body);
    res.json({ id });
  } catch (err) {
    next(err);
  }
}

export async function extractRecipe(req, res, next) {
  try {
    const id = await recipeService.extractRecipe(req.body.raw_text);
    res.json({ id });
  } catch (err) {
    next(err);
  }
}
