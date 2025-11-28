# MindMama

MindMama is a meal-planning and AI-powered recipe assistant designed for busy Muslim mums. The app allows users to plan meals, generate recipes via AI, and build shopping lists automatically.

This repo contains three services:

- `frontend/` — React Native + Expo mobile app
- `backend/` — Node.js API + Firestore
- `ai/` — FastAPI AI Orchestrator (LLM recipes & extraction)

---

## Quick Start

### 1. Clone

``` 
git clone <repo-url>
cd MindMama
``` 
---

## Running Each Service

### Frontend (Expo React Native)

``` 
cd frontend
npm install
npm run start   # or: npx expo start
``` 

---

### AI Orchestrator (Python FastAPI)
``` 
cd ai
python -m venv .venv
.venv/Scripts/activate        # Windows
pip install -r requirements.txt
uvicorn ai.app.main:app --reload --port 8000
``` 
AI service runs at:
``` 
http://localhost:8000
``` 
---

### Backend (Node.js / Express)
``` 
cd backend
npm install
npm start
``` 
Backend runs at:
``` 
http://localhost:4000
``` 
---

## API Reference

For detailed request/response examples and how the frontend should call the backend, see:

- `frontend/API_GUIDE.md`

# Test API Endpoints

Backend:
``` 
GET http://localhost:4000/recipes
``` 
AI:
``` 
POST http://localhost:8000/ai/suggest-meal
``` 
---

# Environment Variables

We never commit `.env` files.
Templates are provided below.

## Backend (`backend/.env`)

To generate Firebase admin credentials:
Go to Firebase Console → Project settings → Service accounts → Generate private key.

Create a file:
``` 
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
``` 
Also see `backend/.env.example` for the template.

---

## AI (`ai/.env`)

### Getting a Groq API key (dev-friendly, free tier)

1. Go to https://console.groq.com/ and create an account.
2. Open **API Keys** in the Groq console.
3. Create a new API key and copy it.
4. In the `ai/` folder, copy `.env.example` → `.env` and set:

   ```env
   GROQ_API_KEY=gsk_your_key_here
   # Optionally comment out OPENAI_API_KEY if you're not using it

---

## Frontend

No `.env` required yet.
API endpoint is set in:

frontend/lib/api.ts

---

# API Overview

The frontend communicates only with the Node backend.  
The backend communicates with:

- Firestore (plans & recipes)
- FastAPI AI Orchestrator (meal suggestions)

---

## Plans API

### Create a plan
POST /plans
``` 
Request:
{
  "startDate": "2025-02-01",
  "days": [
    {
      "date": "2025-02-01",
      "meals": ["Lunch", "Dinner"]
    }
  ]
}

Response:
{
  "id": "m6BbpThWtpQx5kkWvLDi",
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

### Get an existing plan
GET /plans/:id
``` 
Response:
{
  "id": "m6BbpThWtpQx5kkWvLDi",
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
``` 
---

### Add an existing saved recipe
POST /plans/:id/meals/saved
``` 
Request:
{
  "date": "2025-02-01",
  "label": "Dinner",
  "recipeId": "existingRecipeId"
}
``` 
---

## AI Meal Suggestions

### Add an AI-generated recipe to a plan
POST /plans/:id/meals/ai
``` 
Request:
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
### What backend does

1. Sends request to FastAPI:
   POST http://localhost:8000/ai/suggest-meal

2. AI returns:
``` 
   {
     "title": "Moroccan Beef Stew",
     "ingredients": ["1 onion", "2 tomatoes"],
     "steps": ["Fry onions", "Add beef"],
     "prep_time": 15,
     "cook_time": 30
   }
```

4. Backend saves the recipe.
5. Backend attaches the recipe to plan on the date provided.

Frontend does NOT talk to AI directly.

---

## Recipes API

### List all recipes
GET /recipes

### Save a new recipe
POST /recipes
``` 
Body:
{
  "title": "Chicken Pie",
  "ingredients": ["2 chicken breasts", "1 onion"],
  "steps": ["Chop onion", "Fry chicken"]
}
``` 
---

## Shopping List API

POST /shopping-list/:planId
``` 
Response:
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
      "lines": [
        "1 onion"
      ]
    }
  ]
}
``` 
---

# Firestore Data Model

### plans collection:
``` 
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
```
### recipes collection:
```
{
  "title": "Moroccan Beef Stew",
  "ingredients": [],
  "steps": [],
  "prep_time": 10,
  "cook_time": 30,
  "source": "ai"
}
``` 
---

## Endpoints the Frontend Uses

POST /plans  
GET /plans/:id  
POST /plans/:id/meals/ai  
POST /plans/:id/meals/saved  
GET /recipes  
POST /shopping-list/:planId  

No AI endpoint is called by the frontend.

---

# Architecture

We follow clean separation:

- `controllers` → HTTP I/O  
- `services` → business logic  
- `db` → Firestore layer  
- `ai/` → AI recipes + parsing

The diagrams below show how the MindMama system is structured and how meals flow through the app:

<img width="1347" height="670" alt="image" src="https://github.com/user-attachments/assets/97359d7c-d5f9-409d-9f34-bf1bd5cec9eb" />

Below is an overview of the flow:

<img width="668" height="719" alt="MindmMama (meal-prep-module-flow-chart) v2" src="https://github.com/user-attachments/assets/5e4a6fd4-efd5-40ed-95b4-2c9848d9e162" />


---

# Commands

### Backend

npm start

### AI

uvicorn ai.app.main:app --reload --port 8000

### Frontend

npm run start

---

## Development workflow

- AI runs on `http://localhost:8000`
- Backend runs on `http://localhost:4000`
- Frontend calls the backend via `frontend/lib/api.ts`

# Requirements

- Node 18+
- Python 3.10+
- Firebase service account
- Groq account

---

# Development Notes

- `.env` files are ignored and never committed  
- AI + backend integration runs locally  
- Frontend calls REST API through `frontend/lib/api.ts`

---

# Roadmap

- User authentication
- Cloud deployment

