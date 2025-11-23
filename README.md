MindMama — Meal Planning & Mental Load Reduction App

A cross-functional project combining:

React Native frontend

Node.js (Express) backend

FastAPI AI Orchestrator (LLM-powered)

Firestore database

Canonical ingredient mapper + shopping list generator

The goal is to help parents reduce mental load by automatically generating weekly meal plans and a clean, organized shopping list.

📁 Project Structure
MindMama/
│
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── api/             # routes, controllers, middlewares
│   │   ├── config/          # firebase + orchestrator client
│   │   ├── db/              # Firestore access layer
│   │   ├── services/        # business logic for each slice
│   │   ├── index.js         # app bootstrap
│   │   └── app.js           # express setup
│   └── package.json
│
├── ai-orchestrator/         # FastAPI service calling LLMs
│   ├── src/
│   │   ├── app/             # fastapi endpoints
│   │   ├── services/        # llm client, ingredient utils
│   │   ├── prompts/         # prompt templates
│   │   └── models.py        # pydantic schemas
│   └── main.py
│
├── frontend/                # React Native app
│   ├── app/                 # screens, components, hooks
│   ├── assets/
│   └── package.json
│
└── README.md                # THIS FILE

🔧 Technologies
Frontend

React Native (Expo or CLI)

Context API or Zustand (state)

Fetch API for backend calls

Backend (Node.js)

Express

Firestore SDK (firebase-admin)

Axios for AI service communication

Modular service/controller/db structure

AI Orchestrator

FastAPI

OpenAI / Groq / other LLM client

Ingredient normalization + alias mapping

Pydantic for validation

Database

Google Firestore (NoSQL)

🚀 How to Run Everything
1. Backend Setup (Node.js)
cd backend
npm install


Create .env:

PORT=4000
AI_URL=http://localhost:8000
FIREBASE_SERVICE_ACCOUNT={...one-line JSON...}


Run backend:

npm start


Backend will be on:

http://localhost:4000

2. AI Orchestrator Setup (FastAPI)
cd ai-orchestrator
pip install -r requirements.txt


Create .env:

OPENAI_API_KEY=...
MODEL_NAME=gpt-4o-mini


Run:

uvicorn src.app.main:app --reload --port 8000


Should run at:

http://localhost:8000


Test:

curl http://localhost:8000/ai/test

3. Frontend Setup (React Native)
cd frontend
npm install
npm start


Expo will launch on:

http://localhost:19000


The frontend will call:

GET http://localhost:4000/...

POST http://localhost:4000/...

🧩 Backend API Documentation

These endpoints form the core of the app.

🟩 Slice 1 — Plans (Complete)
POST /plans

Create a new meal plan.

Body:

{
  "startDate": "2025-02-01",
  "days": [
    { "date": "2025-02-01", "meals": ["Lunch", "Dinner"] }
  ]
}

GET /plans/:id

Fetch a plan document from Firestore.

🟦 Slice 2 — Attach Meals (AI + Saved)
POST /plans/:id/meals/saved

Attach an existing recipe to a plan slot.

{
  "date": "2025-02-01",
  "label": "Lunch",
  "recipeId": "recipe123"
}

POST /plans/:id/meals/ai

Generate an AI meal + attach it.

{
  "date": "2025-02-01",
  "label": "Dinner",
  "preferences": {
    "time_limit_minutes": 30,
    "dietary_preferences": [],
    "notes": "Quick and easy"
  }
}


Backend flow:

Calls AI Orchestrator /ai/suggest-meal

Receives a RecipeDraft

Saves it in Firestore (source: "ai")

Adds { label, recipeId } to the plan

🟧 Slice 3 — Shopping List
POST /shopping-list/:planId

Generates a canonical, aggregated list.

Backend does:

Load plan

Load recipes referenced by plan

Send to AI Orchestrator /ai/generate-shopping-list

Example response:

{
  "items": [
    { "canonical_name": "tomato", "quantity": 5, "unit": "piece", "category": "produce" }
  ]
}

🟨 Recipes (Saved & Extracted)
GET /recipes

Returns all saved recipes (manual + AI + extracted).

POST /recipes/manual

Save user-written recipe.

POST /recipes/extract

Send pasted text to AI:

{"raw_text": "2 tomatoes chopped...\n1 onion..."}


AI Orchestrator extracts ingredients + steps.

🤖 AI Orchestrator Responsibilities

The FastAPI service ensures:

Consistent, strict JSON (never paragraphs)

Prompt templates for:

meal suggestions

recipe extraction

supportive messages

Ingredient normalization via canonical maps

Unit normalization

Retry and validation of LLM responses

Returns RecipeDraft objects that backend can save directly

This keeps AI separate from business logic → backend stays stable.


🧪 Testing Instructions
Backend

Use Postman or curl:

curl http://localhost:4000/plans/<id>

AI Orchestrator test
curl http://localhost:8000/ai/test

Full e2e test

Create plan

Add AI meal

Add manual recipe

Attach recipe

Generate shopping list

📌 Notes

Never commit .env or Firebase keys

Always install dependencies inside each subfolder

Backend requires Node 18+

AI orchestrator requires Python 3.10+

You can add /plans/:id/full later for easier frontend work
