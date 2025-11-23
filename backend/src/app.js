import express from "express";

import plansRouter from "./api/routes/plans.routes.js";
import recipesRouter from "./api/routes/recipes.routes.js";
import shoppingRouter from "./api/routes/shopping-list.routes.js";
import { errorMiddleware } from "./api/middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/plans", plansRouter);
app.use("/recipes", recipesRouter);
app.use("/shopping-list", shoppingRouter);

app.use(errorMiddleware);

export default app;
