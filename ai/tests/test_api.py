"""
API Tests for AI Orchestrator
Run with: pytest tests/
"""

import pytest
from fastapi.testclient import TestClient
from ai.app.main import app

client = TestClient(app)


class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """Test that health check returns 200"""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestMealSuggestion:
    """Test meal suggestion endpoint"""
    
    def test_suggest_meal_basic(self):
        """Test basic meal suggestion"""
        response = client.post(
            "/ai/suggest-meal",
            json={
                "meal_type": "dinner",
                "num_people": 2,
                "time_available": 30
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "ingredients" in data
        assert "steps" in data
        assert isinstance(data["ingredients"], list)
        assert isinstance(data["steps"], list)
    
    def test_suggest_meal_with_restrictions(self):
        """Test meal suggestion with dietary restrictions"""
        response = client.post(
            "/ai/suggest-meal",
            json={
                "meal_type": "lunch",
                "num_people": 4,
                "time_available": 45,
                "dietary_restrictions": ["vegetarian", "gluten-free"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["ingredients"]) > 0
        assert len(data["steps"]) > 0
    
    def test_suggest_meal_invalid_data(self):
        """Test that invalid data returns error"""
        response = client.post(
            "/ai/suggest-meal",
            json={
                "meal_type": "dinner",
                "num_people": -1,  # Invalid
                "time_available": 30
            }
        )
        assert response.status_code == 422  # Validation error


class TestRecipeExtraction:
    """Test recipe extraction endpoint"""
    
    def test_extract_simple_recipe(self):
        """Test extracting a simple recipe"""
        recipe_text = """
        Spaghetti Carbonara
        
        Ingredients:
        - 400g spaghetti
        - 200g bacon
        - 3 eggs
        - 100g parmesan
        
        Steps:
        1. Boil pasta
        2. Fry bacon
        3. Mix eggs and cheese
        4. Combine everything
        """
        
        response = client.post(
            "/ai/extract-recipe",
            json={"recipe_text": recipe_text}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"]
        assert len(data["ingredients"]) >= 4
        assert len(data["steps"]) >= 4
    
    def test_extract_recipe_empty_text(self):
        """Test that empty recipe text returns error"""
        response = client.post(
            "/ai/extract-recipe",
            json={"recipe_text": ""}
        )
        assert response.status_code == 422  # Validation error


class TestSupportiveMessage:
    """Test supportive message endpoint"""
    
    def test_generate_message_no_context(self):
        """Test message generation without context"""
        response = client.post(
            "/ai/generate-message",
            json={}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert len(data["message"]) > 0
    
    def test_generate_message_with_context(self):
        """Test message generation with context"""
        response = client.post(
            "/ai/generate-message",
            json={"context": "Planning meals for a busy week"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestTestEndpoint:
    """Test the test endpoint"""
    
    def test_test_endpoint(self):
        """Test that test endpoint works"""
        response = client.get("/ai/test")
        # Should return either a recipe or an error dict
        assert response.status_code == 200
        data = response.json()
        # If successful, has recipe data
        # If failed, has error key
        assert "title" in data or "error" in data


class TestShoppingListGeneration:
    """Test shopping list generation endpoint"""
    
    def test_generate_shopping_list_basic(self):
        """Test basic shopping list generation"""
        recipes = [
            {
                "title": "Recipe A",
                "ingredients": ["2 tomatoes", "1 tablespoon olive oil", "1 cup rice"]
            },
            {
                "title": "Recipe B",
                "ingredients": ["3 tomatoes", "2 tablespoons olive oil", "1 cup rice"]
            }
        ]
        
        response = client.post("/ai/generate-shopping-list", json=recipes)
        assert response.status_code == 200
        shopping_list = response.json()
        
        # Should be a list
        assert isinstance(shopping_list, list)
        
        # Should have aggregated items
        assert len(shopping_list) > 0
        
        # Each item should have required fields
        for item in shopping_list:
            assert "name" in item
            assert "total_qty" in item
            assert "unit" in item
            assert "category" in item
    
    def test_generate_shopping_list_with_variations(self):
        """Test shopping list with ingredient variations"""
        recipes = [
            {
                "title": "Recipe A",
                "ingredients": ["2 vine tomatoes", "1 tbsp olive oil"]
            },
            {
                "title": "Recipe B",
                "ingredients": ["3 tomatoes", "2 tablespoons olive oil"]
            }
        ]
        
        response = client.post("/ai/generate-shopping-list", json=recipes)
        assert response.status_code == 200
        shopping_list = response.json()
        
        # Should normalize and aggregate
        assert len(shopping_list) >= 2  # At least tomatoes and olive oil
    
    def test_generate_shopping_list_empty_recipes(self):
        """Test shopping list with empty recipe list"""
        response = client.post("/ai/generate-shopping-list", json=[])
        assert response.status_code == 200
        shopping_list = response.json()
        assert shopping_list == []
    
    def test_generate_shopping_list_missing_ingredients(self):
        """Test shopping list when recipe is missing ingredients"""
        recipes = [
            {
                "title": "Recipe A"
                # Missing ingredients field
            }
        ]
        
        response = client.post("/ai/generate-shopping-list", json=recipes)
        # Should handle gracefully
        assert response.status_code == 200
        shopping_list = response.json()
        assert isinstance(shopping_list, list)


# Integration tests (can be slow, mark as optional)
@pytest.mark.slow
class TestIntegration:
    """Full integration tests"""
    
    def test_full_meal_planning_flow(self):
        """Test complete flow: suggest -> extract -> message"""
        # 1. Suggest a meal
        suggest_response = client.post(
            "/ai/suggest-meal",
            json={
                "meal_type": "dinner",
                "num_people": 2,
                "time_available": 30
            }
        )
        assert suggest_response.status_code == 200
        
        # 2. Extract a recipe
        recipe_text = """
        Quick Pasta
        Ingredients: pasta, sauce, cheese
        Steps: 1. Boil pasta 2. Add sauce 3. Serve
        """
        extract_response = client.post(
            "/ai/extract-recipe",
            json={"recipe_text": recipe_text}
        )
        assert extract_response.status_code == 200
        
        # 3. Generate supportive message
        message_response = client.post(
            "/ai/generate-message",
            json={"context": "Planned 2 meals"}
        )
        assert message_response.status_code == 200


# Utility for running tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])