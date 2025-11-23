"""
AI Prompt Templates
Contains all prompts used to interact with LLMs
Modify these to improve AI output quality
"""

from typing import List, Optional


def get_meal_suggestion_prompt(
    meal_type: str,
    num_people: int,
    time_available: int,
    dietary_restrictions: Optional[List[str]] = None,
    preferences: Optional[str] = None
) -> str:
    """
    Generate prompt for meal suggestion
    
    This is the most important prompt - tune it carefully!
    Tips:
    - Be very specific about the JSON structure
    - Include examples if AI struggles
    - Add constraints to prevent weird outputs
    """
    
    # Build dietary restrictions text
    restrictions_text = ""
    if dietary_restrictions:
        restrictions_text = f"\n- Dietary restrictions: {', '.join(dietary_restrictions)}"
    
    # Build preferences text
    preferences_text = ""
    if preferences:
        preferences_text = f"\n- Additional preferences: {preferences}"
    
    return f"""Suggest a {meal_type} recipe with the following requirements:

REQUIREMENTS:
- Servings: {num_people} people
- Total time available: {time_available} minutes (including prep AND cooking)
{restrictions_text}
{preferences_text}

IMPORTANT RULES:
- Recipe must be realistic and achievable in the time limit
- Ingredients must include SPECIFIC quantities (e.g., "2 chicken breasts", "1 cup rice")
- Use common ingredients that most kitchens have
- Steps should be clear, numbered, and easy to follow
- Make it family-friendly and practical for busy parents
- Prep time + cook time should not exceed {time_available} minutes

Return ONLY valid JSON with this EXACT structure:
{{
  "title": "Recipe Name Here",
  "ingredients": [
    "2 chicken breasts",
    "1 cup rice",
    "2 tablespoons olive oil"
  ],
  "steps": [
    "First step with clear instructions",
    "Second step...",
    "Final step and serving suggestion"
  ],
  "prep_time": 10,
  "cook_time": 20
}}

DO NOT include any text outside the JSON structure.
DO NOT use markdown formatting.
Return ONLY the JSON object."""


def get_recipe_extraction_prompt(recipe_text: str) -> str:
    """
    Generate prompt for recipe extraction
    
    This prompt handles messy input from various sources:
    - Website copy-paste
    - Handwritten recipes typed in
    - Screenshot text
    """
    
    return f"""Extract the recipe information from the following text and convert it into a structured format.

RECIPE TEXT:
{recipe_text}

YOUR TASK:
1. Identify the recipe title
2. Extract all ingredients with their quantities
3. Extract all cooking steps in order
4. Estimate prep time and cook time if mentioned (or set to null if not found)

CLEANING RULES:
- Remove any extra whitespace or formatting
- Standardize ingredient quantities (use "2 cups" not "2 c" or "2c")
- Ensure ingredients have quantities (if missing, make a reasonable guess)
- Number the steps if they aren't already
- Fix any obvious typos
- If ingredient quantities are vague, use reasonable amounts

Return ONLY valid JSON with this EXACT structure:
{{
  "title": "Recipe Name",
  "ingredients": [
    "400g spaghetti",
    "200g bacon",
    "3 eggs"
  ],
  "steps": [
    "Boil pasta in salted water for 8-10 minutes",
    "Fry bacon until crispy",
    "Mix eggs with cheese",
    "Combine all ingredients while pasta is hot"
  ],
  "prep_time": 10,
  "cook_time": 15
}}

IMPORTANT:
- If prep_time or cook_time are not mentioned in the text, use null
- Always include quantities with ingredients
- Keep the original recipe's spirit but clean up the formatting
- If the text is incomplete or unclear, make reasonable assumptions

Return ONLY the JSON object, no additional text."""


def get_supportive_message_prompt(context: Optional[str] = None) -> str:
    """
    Generate prompt for supportive message
    
    These messages should feel genuine and helpful, not cheesy or patronizing
    Think: supportive friend, not corporate motivational poster
    """
    
    context_text = ""
    if context:
        context_text = f"\n\nCONTEXT: {context}"
    
    return f"""Create a brief, warm, and genuinely supportive message for a busy parent managing household tasks and meal planning.{context_text}

MESSAGE GUIDELINES:
- Keep it to 1-2 sentences maximum
- Acknowledge the real mental load of planning and organizing
- Be genuinely encouraging, not cheesy or over-the-top
- Avoid clichés like "you've got this!" or "you're a superhero!"
- Feel like a caring friend, not a corporate motivational poster
- Be specific to meal planning and household management if possible
- Make it feel personal and understanding

TONE: Warm, genuine, understanding, practical

Return ONLY valid JSON:
{{
  "message": "Your supportive message here"
}}

GOOD EXAMPLES:
- "Planning ahead like this gives you back mental space for the things that matter most."
- "Taking time to organize your meals is an investment in calmer, easier days ahead."
- "You're turning chaos into calm, one meal plan at a time."

BAD EXAMPLES (avoid these):
- "You're a superhero mom!" (too cheesy)
- "You've got this!" (too generic)
- "Keep pushing through!" (sounds exhausting)

Return ONLY the JSON object with your message."""


# Additional prompts for future features

def get_meal_plan_optimization_prompt(
    existing_meals: List[dict],
    pantry_items: List[str]
) -> str:
    """
    Future feature: Optimize a week's meal plan
    Suggests how to reuse ingredients across meals
    """
    return f"""Given these planned meals and pantry items, suggest optimizations:

Meals: {existing_meals}
Pantry: {pantry_items}

Suggest ingredient substitutions or meal swaps that:
1. Reduce waste
2. Use up pantry items
3. Balance nutrition across the week

Return optimized meal plan as JSON."""


def get_shopping_list_prompt(meals: List[dict]) -> str:
    """
    Future feature: Generate shopping list from meal plan
    (This will likely be handled by the Shopping List Generator service)
    """
    return f"""From these meals, create a consolidated shopping list:

{meals}

Combine duplicate ingredients and organize by category.
Return JSON with categories: produce, meat, dairy, pantry, etc."""