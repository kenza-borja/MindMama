"""
LLM Client - Wrapper for OpenAI/Groq API calls
Handles retries, error handling, and JSON validation
"""

import os
import json
import time
from typing import Dict, Any
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)


class LLMClient:
    """
    Unified client for LLM APIs (OpenAI or Groq)
    Automatically detects which provider to use based on env variables
    """
    
    def __init__(self):
        """
        Initialize LLM client
        Checks for API keys and sets up the appropriate provider
        """
        self.provider = self._detect_provider()
        self.max_retries = int(os.getenv("MAX_RETRIES", "3"))
        self.timeout = int(os.getenv("TIMEOUT_SECONDS", "30"))
        
        if self.provider == "openai":
            self._init_openai()
        elif self.provider == "groq":
            self._init_groq()
        else:
            raise ValueError(
                "No API key found! Set either OPENAI_API_KEY or GROQ_API_KEY in .env file"
            )
        
        logger.info(f"LLM Client initialized with provider: {self.provider}, model: {self.model}")
    
    def _detect_provider(self) -> str:
        """
        Detect which LLM provider to use based on available API keys
        Priority: OpenAI > Groq
        """
        if os.getenv("OPENAI_API_KEY"):
            return "openai"
        elif os.getenv("GROQ_API_KEY"):
            return "groq"
        return None
    
    def _init_openai(self):
        """Initialize OpenAI client"""
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
            self.temperature = float(os.getenv("TEMPERATURE", "0.7"))
            logger.info("OpenAI client initialized")
        except ImportError:
            raise ImportError("OpenAI library not installed. Run: pip install openai")
    
    def _init_groq(self):
        """Initialize Groq client"""
        try:
            from groq import Groq
            self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile") #llama-3.1-8b-instant
            self.temperature = float(os.getenv("TEMPERATURE", "0.7"))
            logger.info("Groq client initialized")
        except ImportError:
            raise ImportError("Groq library not installed. Run: pip install groq")
    
    def call_llm(self, prompt: str) -> Dict[str, Any]:
        """
        Call LLM with retry logic and JSON enforcement
        
        Args:
            prompt: The prompt to send to the LLM
            
        Returns:
            Dict containing the parsed JSON response
            
        Raises:
            ValueError: If JSON parsing fails after all retries
            Exception: If API call fails after all retries
        """
        for attempt in range(self.max_retries):
            try:
                logger.debug(f"Attempt {attempt + 1}/{self.max_retries}")
                
                # Make the API call
                response = self._make_api_call(prompt)
                
                # Extract content
                content = response.choices[0].message.content
                logger.debug(f"Raw response: {content[:200]}...")
                
                # Parse JSON
                parsed = json.loads(content)
                logger.info("Successfully parsed JSON response")
                return parsed
                
            except json.JSONDecodeError as e:
                logger.warning(f"Attempt {attempt + 1}: JSON parsing failed - {e}")
                if attempt == self.max_retries - 1:
                    logger.error(f"All retries exhausted. Last response: {content}")
                    raise ValueError(
                        f"LLM returned invalid JSON after {self.max_retries} attempts. "
                        f"Last error: {str(e)}"
                    )
                time.sleep(1)  # Brief pause before retry
                
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1}: API call failed - {e}")
                if attempt == self.max_retries - 1:
                    logger.error("All retries exhausted")
                    raise Exception(
                        f"LLM API call failed after {self.max_retries} attempts. "
                        f"Last error: {str(e)}"
                    )
                time.sleep(2)  # Longer pause for API errors
        
        raise ValueError("Max retries exceeded")
    
    def _make_api_call(self, prompt: str):
        """
        Make the actual API call to the LLM provider
        
        Args:
            prompt: The prompt to send
            
        Returns:
            API response object
        """
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful cooking assistant that ALWAYS responds with valid JSON. "
                    "Never include explanations or text outside the JSON structure. "
                    "Be practical, family-friendly, and considerate of busy parents."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
        
        if self.provider == "openai":
            return self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                response_format={"type": "json_object"},  # Forces JSON output
                timeout=self.timeout
            )
        
        elif self.provider == "groq":
            # Groq doesn't support response_format yet, but is usually good at JSON
            return self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                timeout=self.timeout
            )
    
    def test_connection(self) -> bool:
        """
        Test if the LLM connection is working
        
        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            test_prompt = """Return this exact JSON and nothing else:
            {"status": "connected", "test": true}"""
            
            response = self.call_llm(test_prompt)
            return response.get("status") == "connected"
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False


# Utility function for quick testing
def test_llm_client():
    """
    Quick test function to verify LLM client setup
    Run this to check if your API keys are working
    """
    print("Testing LLM Client...")
    
    try:
        client = LLMClient()
        print(f"✓ Provider: {client.provider}")
        print(f"✓ Model: {client.model}")
        
        print("\nTesting connection...")
        if client.test_connection():
            print("✓ Connection successful!")
            
            print("\nTesting meal suggestion...")
            prompt = """Suggest a quick dinner recipe.
            Return JSON with: title, ingredients (list), steps (list), prep_time, cook_time"""
            
            result = client.call_llm(prompt)
            print(f"✓ Got response: {result.get('title', 'Unknown')}")
            print("\n✓ All tests passed! LLM client is ready.")
            return True
        else:
            print("✗ Connection test failed")
            return False
            
    except Exception as e:
        print(f"✗ Test failed: {e}")
        return False


if __name__ == "__main__":
    # Run tests when this file is executed directly
    test_llm_client()