"""
Data models for AI Orchestrator
Defines request/response schemas using Pydantic
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class RecipeDraft(BaseModel):
    """
    Structured recipe output from AI
    This is the main data format returned by all recipe endpoints
    """
    title: str = Field(
        ...,
        description="Recipe name",
        example="Quick Vegetable Stir-Fry"
    )
    ingredients: List[str] = Field(
        ...,
        description="List of ingredients with quantities",
        example=["2 chicken breasts", "1 cup rice", "2 tablespoons soy sauce"]
    )
    steps: List[str] = Field(
        ...,
        description="Cooking instructions in order",
        example=["Cut chicken into strips", "Heat oil in pan", "Cook chicken for 5 minutes"]
    )
    prep_time: Optional[int] = Field(
        None,
        description="Prep time in minutes",
        example=10
    )
    cook_time: Optional[int] = Field(
        None,
        description="Cook time in minutes",
        example=20
    )

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Quick Chicken Stir-Fry",
                "ingredients": [
                    "2 chicken breasts",
                    "1 cup rice",
                    "2 tablespoons soy sauce",
                    "1 cup broccoli florets"
                ],
                "steps": [
                    "Cut chicken into strips",
                    "Heat oil in large pan over medium-high heat",
                    "Cook chicken for 5-7 minutes until golden",
                    "Add broccoli and soy sauce, stir-fry 3 minutes",
                    "Serve over cooked rice"
                ],
                "prep_time": 10,
                "cook_time": 15
            }
        }


class MealSuggestionRequest(BaseModel):
    """
    Request model for meal suggestion endpoint
    """
    meal_type: str = Field(
        ...,
        description="Type of meal: breakfast, lunch, dinner, snack",
        example="dinner"
    )
    num_people: int = Field(
        2,
        description="Number of servings needed",
        ge=1,
        le=12,
        example=2
    )
    time_available: int = Field(
        30,
        description="Minutes available to cook (including prep)",
        ge=5,
        le=180,
        example=30
    )
    dietary_restrictions: Optional[List[str]] = Field(
        None,
        description="Dietary restrictions (e.g., vegetarian, vegan, gluten-free, dairy-free, nut-free)",
        example=["vegetarian", "gluten-free"]
    )
    preferences: Optional[str] = Field(
        None,
        description="Any additional preferences or context",
        example="something with pasta and lots of vegetables"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "meal_type": "dinner",
                "num_people": 4,
                "time_available": 45,
                "dietary_restrictions": ["vegetarian"],
                "preferences": "Italian cuisine, family-friendly"
            }
        }


class RecipeExtractionRequest(BaseModel):
    """
    Request model for recipe extraction endpoint
    """
    recipe_text: str = Field(
        ...,
        description="Raw recipe text to parse (from website, book, or manual entry)",
        min_length=10,
        example="Spaghetti Carbonara\n\nIngredients:\n- 400g spaghetti\n- 200g bacon\n- 3 eggs\n\nSteps:\n1. Boil pasta..."
    )

    class Config:
        json_schema_extra = {
            "example": {
                "recipe_text": """
Spaghetti Carbonara

Ingredients:
- 400g spaghetti
- 200g bacon, diced
- 3 large eggs
- 100g parmesan cheese, grated
- 2 cloves garlic
- Salt and black pepper

Instructions:
1. Boil pasta in salted water according to package directions
2. While pasta cooks, fry bacon until crispy
3. Beat eggs with parmesan cheese
4. Drain pasta, reserving 1 cup pasta water
5. Combine hot pasta with bacon
6. Remove from heat, quickly stir in egg mixture
7. Add pasta water to reach desired consistency
8. Season with salt and pepper, serve immediately
                """.strip()
            }
        }


class SupportiveMessageRequest(BaseModel):
    """
    Request model for supportive message generation
    """
    context: Optional[str] = Field(
        None,
        description="Current situation or context for the message",
        example="Planning meals for a busy week ahead"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "context": "User is meal planning while juggling work and kids' schedules"
            }
        }


class HealthCheckResponse(BaseModel):
    """
    Response model for health check endpoint
    """
    status: str = Field(..., example="healthy")
    message: str = Field(..., example="AI Orchestrator is running")
    version: str = Field(..., example="1.0.0")