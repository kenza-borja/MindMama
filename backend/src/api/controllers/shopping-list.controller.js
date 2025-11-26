import * as shoppingListService from "../../services/shopping-list.service.js";

export async function generateShoppingList(req, res, next) {
  try {
    const { planId } = req.params;
    const result = await shoppingListService.generateShoppingList(planId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}