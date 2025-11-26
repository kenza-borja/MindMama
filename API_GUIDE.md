# MindMama Backend API Guide

Base development URL:

```
http://localhost:4000
```

> For Android emulator:
> ```
> http://10.0.2.2:4000
> ```
> For iOS simulator:
> ```
> http://127.0.0.1:4000
> ```

---

# General Notes

All requests and responses use JSON.

Errors always follow this format:

```json
{
  "error": "Human readable message"
}
```

---

# ===================
# 1. Meal Plans
# ===================

## Create a Plan

**POST** `/plans`

### Body:
```json
{
  "startDate": "2025-02-01",
  "days": [
    { "date": "2025-02-01", "meals": ["Lunch", "Dinner"] },
    { "date": "2025-02-02", "meals": ["Lunch"] }
  ]
}
```

### Response:
```json
{
  "id": "PLAN_ID",
  "startDate": "2025-02-01",
  "days": [
    {
      "date": "2025-02-01",
      "meals": ["Lunch", "Dinner"]
    }
  ]
}
```

---

## Get a Plan

**GET** `/plans/:planId`

### Response:
```json
{
  "id": "PLAN_ID",
  "startDate": "2025-02-01",
  "days": [
    {
      "date": "2025-02-01",
      "meals": [
        "Lunch",
        { "label": "Dinner", "recipeId": "RECIPE_ID" }
      ]
    }
  ]
}
```

---

## Add an Existing Meal to a Plan

**POST** `/plans/:planId/meals/saved`

### Body:
```json
{
  "date": "2025-02-01",
  "label": "Lunch",
  "recipeId": "RECIPE_ID"
}
```

### Response:
Same shape as `GET /plans/:planId`

---

## Add an AI-Suggested Meal

**POST** `/plans/:planId/meals/ai`

### Body:
```json
{
  "date": "2025-02-01",
  "label": "Dinner",
  "preferences": {
    "num_people": 2,
    "time_available": 45,
    "dietary_restrictions": [],
    "preferences_text": "Moroccan"
  }
}
```

### Response:
Updated plan with recipe added.

---

# ===================
# 2. Recipes
# ===================

## List Recipes

**GET** `/recipes`

### Response:
```json
[
  {
    "id": "RECIPE_ID",
    "title": "Moroccan Beef Stew",
    "ingredients": ["1 onion", "2 tomatoes"],
    "steps": ["Step 1", "Step 2"],
    "prep_time": 15,
    "cook_time": 30,
    "source": "ai"
  }
]
```

---

# ===================
# 3. Generate Shopping List
# ===================

## Generate shopping list for a plan

**POST** `/shopping-list/:planId`

### Response:
```json
{
  "planId": "PLAN_ID",
  "items": [
    {
      "name": "tomatoes",
      "lines": [
        "2 tomatoes",
        "200g chopped tomatoes"
      ]
    },
    {
      "name": "onion",
      "lines": ["1 onion"]
    }
  ]
}
```

---

# ===================
# 4. AI Orchestrator (reference only)
# ===================

Backend internally calls:

```
POST http://localhost:8000/ai/suggest-meal
POST http://localhost:8000/ai/extract-recipe
```

Frontend **does NOT call those directly**.

---

# ===================
# 5. Example usage (React Native)
# ===================

```ts
import { createPlan, addAiMealToPlan, getShoppingList } from "./api";

const plan = await createPlan({
  startDate: "2025-02-01",
  days: [
    { date: "2025-02-01", meals: ["Lunch", "Dinner"] }
  ]
});

const updated = await addAiMealToPlan(plan.id, {
  date: "2025-02-01",
  label: "Dinner",
  preferences: { preferences_text: "Italian" }
});

const list = await getShoppingList(plan.id);
console.log(list);
```
