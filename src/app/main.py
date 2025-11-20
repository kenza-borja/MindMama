"""
AI Orchestrator - Main FastAPI Application
Handles meal suggestions, recipe extraction, and supportive messaging
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import logging

from models import (
    RecipeDraft,
    MealSuggestionRequest,
    RecipeExtractionRequest,
    SupportiveMessageRequest,
    HealthCheckResponse
)

from services.llm_client import LLMClient
from prompts import (
    get_meal_suggestion_prompt,
    get_recipe_extraction_prompt,
    get_supportive_message_prompt
)
from config import API_VERSION, LOG_LEVEL
from src.services.utils import normalize_ingredients, shopping_list_from_recipes

# Set up logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Orchestrator",
    description="AI-powered meal planning and recipe management service",
    version=API_VERSION
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM client
llm_client = LLMClient()


@app.get("/", response_model=HealthCheckResponse)
async def health_check():
    """
    Health check endpoint - verify service is running
    """
    logger.info("Health check requested")
    return {
        "status": "healthy",
        "message": "AI Orchestrator is running",
        "version": API_VERSION
    }


@app.post("/ai/suggest-meal", response_model=RecipeDraft)
async def suggest_meal(request: MealSuggestionRequest):
    """
    Generate meal suggestion based on user preferences
    
    Args:
        request: MealSuggestionRequest with meal preferences
        
    Returns:
        RecipeDraft: Structured recipe with title, ingredients, steps
        
    Example:
        POST /ai/suggest-meal
        {
            "meal_type": "dinner",
            "num_people": 2,
            "time_available": 30,
            "dietary_restrictions": ["vegetarian"]
        }
    """
    try:
        logger.info(f"Meal suggestion requested: {request.meal_type} for {request.num_people} people")
        
        # Build prompt
        prompt = get_meal_suggestion_prompt(
            meal_type=request.meal_type,
            num_people=request.num_people,
            time_available=request.time_available,
            dietary_restrictions=request.dietary_restrictions,
            preferences=request.preferences
        )
        
        logger.debug(f"Prompt: {prompt[:200]}...")
        
        # Call LLM
        response = llm_client.call_llm(prompt)
        logger.debug(f"LLM response received: {response}")
        
        # Normalize ingredients using canonical names
        if "ingredients" in response:
            response["ingredients"] = normalize_ingredients(response["ingredients"])
        
        # Validate and return
        recipe = RecipeDraft(**response)
        logger.info(f"Successfully generated recipe: {recipe.title}")
        return recipe
        
    except ValueError as e:
        logger.error(f"Validation error in meal suggestion: {e}")
        raise HTTPException(status_code=422, detail=f"Invalid AI response: {str(e)}")
    except Exception as e:
        logger.error(f"Error in meal suggestion: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.post("/ai/extract-recipe", response_model=RecipeDraft)
async def extract_recipe(request: RecipeExtractionRequest):
    """
    Extract structured recipe from unstructured text
    
    Args:
        request: RecipeExtractionRequest with raw recipe text
        
    Returns:
        RecipeDraft: Structured recipe data
        
    Example:
        POST /ai/extract-recipe
        {
            "recipe_text": "Pasta Recipe\n\nIngredients:\n- 400g pasta\n- sauce\n\nSteps:\n1. Boil water..."
        }
    """
    try:
        logger.info("Recipe extraction requested")
        logger.debug(f"Recipe text length: {len(request.recipe_text)} characters")
        
        # Build prompt
        prompt = get_recipe_extraction_prompt(request.recipe_text)
        
        # Call LLM
        response = llm_client.call_llm(prompt)
        logger.debug(f"Extraction response: {response}")
        
        # Normalize ingredients
        if "ingredients" in response:
            response["ingredients"] = normalize_ingredients(response["ingredients"])
        
        # Validate and return
        recipe = RecipeDraft(**response)
        logger.info(f"Successfully extracted recipe: {recipe.title}")
        return recipe
        
    except ValueError as e:
        logger.error(f"Validation error in recipe extraction: {e}")
        raise HTTPException(status_code=422, detail=f"Invalid recipe format: {str(e)}")
    except Exception as e:
        logger.error(f"Error in recipe extraction: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Recipe extraction failed: {str(e)}")


@app.post("/ai/generate-shopping-list")
async def generate_shopping_list(recipes: List[dict]):
    """
    Generate aggregated shopping list from multiple recipes
    
    Args:
        recipes: List of recipe dictionaries, each with 'ingredients' key
        
    Returns:
        List[dict]: Aggregated shopping list with normalized ingredients
        
    Example:
        POST /ai/generate-shopping-list
        [
            {
                "title": "Recipe A",
                "ingredients": ["2 vine tomatoes", "1 tbsp olive oil"]
            },
            {
                "title": "Recipe B", 
                "ingredients": ["3 tomatoes", "2 tablespoons olive oil"]
            }
        ]
        
    Response:
        [
            {
                "name": "tomato",
                "total_qty": 5.0,
                "unit": null,
                "category": "produce"
            },
            {
                "name": "olive oil",
                "total_qty": 3.0,
                "unit": "tablespoon",
                "category": "pantry"
            }
        ]
    """
    try:
        logger.info(f"Shopping list generation requested for {len(recipes)} recipes")
        
        # Validate that all recipes have ingredients
        for idx, recipe in enumerate(recipes):
            if "ingredients" not in recipe:
                logger.warning(f"Recipe at index {idx} missing 'ingredients' field")
                recipe["ingredients"] = []
        
        # Generate aggregated shopping list using your utils function
        shopping_list = shopping_list_from_recipes(recipes)
        
        logger.info(f"Successfully generated shopping list with {len(shopping_list)} items")
        return shopping_list
        
    except Exception as e:
        logger.error(f"Error generating shopping list: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Shopping list generation failed: {str(e)}"
        )

@app.post("/ai/generate-message")
async def generate_supportive_message(request: SupportiveMessageRequest):
    """
    Generate supportive, encouraging message for daily planning
    
    Args:
        request: SupportiveMessageRequest with optional context
        
    Returns:
        dict: Contains 'message' key with supportive text
        
    Example:
        POST /ai/generate-message
        {
            "context": "Planning meals for a busy week"
        }
    """
    try:
        logger.info("Supportive message requested")
        
        # Build prompt
        prompt = get_supportive_message_prompt(request.context)
        
        # Call LLM
        response = llm_client.call_llm(prompt)
        logger.debug(f"Message response: {response}")
        
        if "message" not in response:
            raise ValueError("AI did not return a message")
        
        logger.info("Successfully generated supportive message")
        return response
        
    except Exception as e:
        logger.error(f"Error generating message: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Message generation failed: {str(e)}")


@app.get("/ai/test")
async def test_endpoint():
    """
    Simple test endpoint to verify AI connection
    Returns a test recipe suggestion
    """
    try:
        test_request = MealSuggestionRequest(
            meal_type="dinner",
            num_people=2,
            time_available=30
        )
        return await suggest_meal(test_request)
    except Exception as e:
        return {
            "error": str(e),
            "message": "AI connection test failed. Check your API key in .env file"
        }


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting AI Orchestrator server...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level=LOG_LEVEL.lower()
    )