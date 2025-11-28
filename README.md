# MindMama

MindMama is a meal-planning and AI-powered recipe assistant designed for busy Muslim mums. The app allows users to plan meals, generate recipes via AI, and build shopping lists automatically.

This repo contains three services:

- `frontend/` — React Native + Expo mobile app
- `backend/` — Node.js API + Firestore
- `ai/` — FastAPI AI Orchestrator (LLM recipes & extraction)

---

## Quick Start

### 1. Clone

git clone <repo-url>
cd MindMama

---

## Running Each Service

### Frontend (Expo React Native)

cd frontend
npm install
npm run start   # or: npx expo start

---

### AI Orchestrator (Python FastAPI)

cd ai
python -m venv .venv
.venv/Scripts/activate        # Windows
pip install -r requirements.txt
uvicorn ai.app.main:app --reload --port 8000

AI service runs at:

http://localhost:8000

---

### Backend (Node.js / Express)

cd backend
npm install
npm start

Backend runs at:

http://localhost:4000

---

# Test API Endpoints

Backend:

GET http://localhost:4000/recipes

AI:

POST http://localhost:8000/ai/suggest-meal

---

# Environment Variables

We never commit `.env` files.
Templates are provided below.

## Backend (`backend/.env`)

To generate Firebase admin credentials:
Go to Firebase Console → Project settings → Service accounts → Generate private key.

Create a file:

PORT=4000
AI_URL=http://localhost:8000

FIREBASE_SERVICE_ACCOUNT={
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nxxx\\n-----END PRIVATE KEY-----\\n",
  "client_email": "firebase-adminsdk@YOUR_PROJECT_ID.iam.gserviceaccount.com",
  "client_id": "000000",
  "token_uri": "https://oauth2.googleapis.com/token",
  "universe_domain": "googleapis.com"
}

Also see `backend/.env.example` for the template.

---

## AI (`ai/.env`)

Copy `ai/.env.example` → `ai/.env` and fill in:

OPENAI_API_KEY=your-key
# OR
GROQ_API_KEY=your-key

---

## Frontend

No `.env` required yet.
API endpoint is set in:

frontend/lib/api.ts

---

# Project Structure

MindMama/
  frontend/
  backend/
    src/
      api/
        controllers/
        routes/
        middlewares/
      services/
      db/
      config/
      index.js
      app.js
  ai/
  .gitignore
  README.md

---

# Core Features

## Slice 1 — Plans & Recipes (DONE)

✔ Create meal plans  
✔ Retrieve plans  
✔ Add saved recipes  
✔ Save user recipes  

---

## Slice 2 — AI Meal Generation (DONE)

Endpoint:

POST /plans/:id/meals/ai

Example:

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

AI returns:

- title  
- ingredients[]  
- steps[]  
- prep_time  
- cook_time  

Backend then:

- saves recipe to Firestore  
- attaches recipe to plan on the given date  

---

## Slice 3 — Shopping List (DONE)

POST /shopping-list/:id

Generates merged ingredient list from recipes.

---

# 🗄 Firestore Data Model

### plans collection

{
  "startDate": "2025-02-01",
  "days": [
    {
      "date": "2025-02-01",
      "meals": [
        { "label": "Lunch", "recipeId": "xyz123" }
      ]
    }
  ]
}

### recipes collection

{
  "title": "Moroccan Beef Stew",
  "ingredients": [],
  "steps": [],
  "prep_time": 10,
  "cook_time": 30,
  "source": "ai"
}

---

# Architecture

We follow clean separation:

- `controllers` → HTTP I/O  
- `services` → business logic  
- `db` → Firestore layer  
- `ai/` → AI recipes + parsing  

---

# Commands

### Backend

npm start

### AI

uvicorn ai.app.main:app --reload --port 8000

### Frontend

npm run start

---

# Requirements

- Node 18+
- Python 3.10+
- Firebase service account
- Qroq account

---

# Development Notes

- `.env` files are ignored and never committed  
- AI + backend integration runs locally  
- Frontend calls REST API through `frontend/lib/api.ts`

---

# Roadmap

- User authentication
- Cloud deployment

