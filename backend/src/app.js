import cors from "cors";
import express from "express";

import plansRouter from "./api/routes/plans.routes.js";
import recipesRouter from "./api/routes/recipes.routes.js";
import shoppingListRoutes from "./api/routes/shopping-list.routes.js";
//import todayRoutes from "./api/routes/today.routes.js";
import { authMiddleware } from "./api/middlewares/auth.middleware.js";
import { errorMiddleware } from "./api/middlewares/error.middleware.js";
import { getEnv } from "./config/env.js";

const app = express();

const { ALLOWED_ORIGINS } = getEnv();
const allowList = ALLOWED_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: allowList?.length ? allowList : true,
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

app.use(express.json());

// Before auth: hosting platforms ping this to decide if the service is alive.
app.get("/health", (req, res) => res.json({ ok: true }));

app.use(authMiddleware);

app.use("/plans", plansRouter);
app.use("/recipes", recipesRouter);
app.use("/shopping-list", shoppingListRoutes);
//app.use("/today", todayRoutes);

app.use(errorMiddleware);

export default app;
