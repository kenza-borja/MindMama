import { Router } from "express";
import * as plans from "../controllers/plans.controller.js";

const router = Router();

router.post("/", plans.createPlan);
router.get("/:id", plans.getPlan);

router.post("/:id/meals/saved", plans.addMealFromSaved);
router.post("/:id/meals/ai", plans.addMealFromAi);

export default router;
