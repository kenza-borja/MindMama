# MindMama Backend

This is the Node.js backend for the MindMama meal-planning system. It provides Firestore data storage, plan and recipe management, and integration with the AI Orchestrator (FastAPI).

---

## How to Run the Entire System

### 1. Clone the repository

~~~
git clone <repo-url>
cd MindMama
~~~

### 2. Start the AI Orchestrator (Python / FastAPI)

Inside the `ai/` directory:

~~~
cd ai
python -m venv .venv
.venv/Scripts/activate     # Windows
pip install -r requirements.txt
uvicorn ai.app.main:app --reload --port 8000
~~~

The AI server will be available at:

~~~
http://localhost:8000
~~~

### 3. Start the Backend (Node.js / Express)

Inside the `backend/` directory:

~~~
cd backend
npm install
npm start
~~~

Backend will start at:

~~~
http://localhost:4000
~~~

Make sure your `.env` file exists and contains your Firebase credentials.

### 4. Test Everything

Use Postman or Thunder Client:

- Test backend:
  ~~~
  GET http://localhost:4000/recipes
  ~~~

- Test AI:
  ~~~
  POST http://localhost:8000/ai/suggest-meal
  ~~~

---

## Project Structure

~~~
backend/
  src/
    api/
      controllers/
      routes/
      middlewares/
    config/
      env.js
      firebase.js
      orchestrator.js
    db/
      plans.db.js
      recipes.db.js
    services/
      meal-planner.service.js
      recipes.service.js
      shopping-list.service.js
      today.service.js
    app.js
    index.js
~~~

---

## Requirements

- Node.js (v18+)
- Firebase Service Account (.env)
- AI Orchestrator running on port 8000

---

## Environment Variables

Create `.env` in backend:

~~~
PORT=4000
AI_URL=http://localhost:8000

FIREBASE_SERVICE_ACCOUNT={
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nXXX\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@YOUR_PROJECT_ID.iam.gserviceaccount.com",
  "client_id": "000000",
  "token_uri": "https://oauth2.googleapis.com/token"
}
~~~

---

## Running the Backend

~~~
npm install
npm start
~~~

Backend runs at:

~~~
http://localhost:4000
~~~

---

## API Overview

### Plans

#### Create a plan

~~~
POST /plans
~~~

Example body:

~~~json
{
  "startDate": "2025-02-01",
  "days": [
    {
      "date": "2025-02-01",
      "meals": ["Lunch", "Dinner"]
    }
  ]
}
~~~

#### Get a plan

~~~
GET /plans/:id
~~~

#### Add saved meal to a plan

~~~
POST /plans/:id/meals/saved
~~~

Body:

~~~json
{
  "date": "2025-02-01",
  "label": "Lunch",
  "recipeId": "existingRecipeId"
}
~~~

---

## AI Meal Generation (Slice 2)

The backend integrates with the AI Orchestrator (FastAPI) to generate complete recipes.

### Add an AI meal to a plan

~~~
POST /plans/:id/meals/ai
~~~

Example request:

~~~json
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
~~~

### Expected Flow

1. Backend sends MealSuggestionRequest to FastAPI:
   ~~~
   POST http://localhost:8000/ai/suggest-meal
   ~~~
2. AI returns:
   - title  
   - ingredients[]  
   - steps[]  
   - prep_time  
   - cook_time  
3. Backend saves recipe into Firestore (`recipes`)
4. Backend attaches `recipeId` to the plan

---

## Recipes

#### List all recipes

~~~
GET /recipes
~~~

#### Save custom user recipe

~~~
POST /recipes
~~~

---

## Firestore Data Model

### plans collection

~~~
{
  id: string,
  startDate: string,
  days: [
    {
      date: string,
      meals: [
        "Lunch",
        { label: "Dinner", recipeId: "abc123" }
      ]
    }
  ]
}
~~~

### recipes collection

~~~
{
  id: string,
  title: string,
  ingredients: [],
  steps: [],
  prep_time: number,
  cook_time: number,
  source: "ai" | "user"
}
~~~

---

## Development Notes

### Slice 1 (Completed)

- Plan creation  
- Plan retrieval  
- Add saved meals  
- Save user recipes  

### Slice 2 (Completed)

- AI recipe generation  
- Save AI recipes to Firestore  
- Attach AI meals to plan slots  

### Upcoming Slices

- Shopping list generator  
- Today/Planner service  
- Frontend integration  

---

## Tests

~~~
npm test
~~~

---

## Code Quality Guide

- Services = business logic  
- Controllers = HTTP request/response  
- DB files = Firestore operations  
- Config = environment + external clients  

---

## Deployment (Later)

- Firebase Hosting  
- Cloud Run or Render  
- Environment separation (dev/stage/prod)

---

Backend requires Node 18+

AI orchestrator requires Python 3.10+

You can add /plans/:id/full later for easier frontend work
