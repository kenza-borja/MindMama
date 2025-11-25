import { Router } from "express";
import * as list from "../controllers/shopping-list.controller.js";

const router = Router();

router.post("/:id", list.generate);

export default router;
