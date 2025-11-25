import { Router } from "express";
import * as recipes from "../controllers/recipes.controller.js";

const router = Router();

router.get("/", recipes.listRecipes);
router.post("/manual", recipes.createManual);
router.post("/extract", recipes.extractRecipe);

export default router;
