import { Router } from "express";
import * as shoppingListController from "../controllers/shopping-list.controller.js";

const router = Router();

// POST /shopping-list/:planId
router.post("/:planId", shoppingListController.generateShoppingList);

export default router;
