import express from "express";

import plansRouter from "./api/routes/plans.routes.js";
import recipesRouter from "./api/routes/recipes.routes.js";
import shoppingListRoutes from "./api/routes/shopping-list.routes.js";
//import todayRoutes from "./api/routes/today.routes.js";
import { errorMiddleware } from "./api/middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/plans", plansRouter);
app.use("/recipes", recipesRouter);
app.use("/shopping-list", shoppingListRoutes);
//app.use("/today", todayRoutes);

app.use(errorMiddleware);

export default app;
