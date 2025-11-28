import * as mealPlanner from "../../services/meal-planner.service.js";

export async function createPlan(req, res, next) {
  try {
    const plan = await mealPlanner.createPlan(req.body);
    res.json(plan);
  } catch (err) {
    next(err);
  }
}

export async function getPlan(req, res, next) {
  try {
    const plan = await mealPlanner.getPlan(req.params.id);
    res.json(plan);
  } catch (err) {
    next(err);
  }
}

export async function addMealFromSaved(req, res, next) {
  try {
    const result = await mealPlanner.addMealFromSaved({
      planId: req.params.id,
      ...req.body
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addMealFromAi(req, res, next) {
  try {
    const result = await mealPlanner.addMealFromAi({
      planId: req.params.id,
      ...req.body
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
