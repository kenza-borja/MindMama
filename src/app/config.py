# src/app/config.py
"""
Robust config for the AI Orchestrator (hackathon-friendly).

- Loads .env from project root
- Reads environment variables with safe defaults
- Exposes `settings` object for import elsewhere
- Performs non-fatal validation (warns instead of raising) so tests/imports don't crash
"""

import os
import warnings
from dotenv import load_dotenv
from pathlib import Path
from dataclasses import dataclass

# Load .env located at project root (two levels up from this file: src/app -> project root)
ROOT = Path(__file__).resolve().parents[2]
dotenv_path = ROOT / ".env"
load_dotenv(dotenv_path.as_posix(), override=True)

# Helper to parse bool-like env vars
def _bool_env(name: str, default: bool) -> bool:
    val = os.getenv(name)
    if val is None:
        return default
    return str(val).strip().lower() in ("1", "true", "yes", "y")

# Read env variables safely with defaults
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")

TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
TIMEOUT_SECONDS = int(os.getenv("TIMEOUT_SECONDS", "30"))

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
DEBUG = _bool_env("DEBUG", False)
API_VERSION = "1.0.0"

MAX_SERVINGS = int(os.getenv("MAX_SERVINGS", "12"))
MAX_COOK_TIME = int(os.getenv("MAX_COOK_TIME", "180"))
MAX_RECIPE_TEXT_LENGTH = int(os.getenv("MAX_RECIPE_TEXT_LENGTH", "10000"))

ENABLE_MEAL_SUGGESTIONS = _bool_env("ENABLE_MEAL_SUGGESTIONS", True)
ENABLE_RECIPE_EXTRACTION = _bool_env("ENABLE_RECIPE_EXTRACTION", True)
ENABLE_SUPPORTIVE_MESSAGES = _bool_env("ENABLE_SUPPORTIVE_MESSAGES", True)
ENABLE_CACHING = _bool_env("ENABLE_CACHING", False)

@dataclass
class Settings:
    openai_api_key: str = OPENAI_API_KEY
    groq_api_key: str = GROQ_API_KEY
    openai_model: str = OPENAI_MODEL
    groq_model: str = GROQ_MODEL
    temperature: float = TEMPERATURE
    max_retries: int = MAX_RETRIES
    timeout_seconds: int = TIMEOUT_SECONDS
    log_level: str = LOG_LEVEL
    debug: bool = DEBUG
    max_servings: int = MAX_SERVINGS
    max_cook_time: int = MAX_COOK_TIME
    max_recipe_text_length: int = MAX_RECIPE_TEXT_LENGTH
    enable_meal_suggestions: bool = ENABLE_MEAL_SUGGESTIONS
    enable_recipe_extraction: bool = ENABLE_RECIPE_EXTRACTION
    enable_supportive_messages: bool = ENABLE_SUPPORTIVE_MESSAGES
    enable_caching: bool = ENABLE_CACHING

settings = Settings()

# Validation (non-fatal) — warn if critical settings appear missing
def _validate_config():
    errors = []
    if not settings.openai_api_key and not settings.groq_api_key:
        errors.append("No LLM API key found: set OPENAI_API_KEY or GROQ_API_KEY in .env")
    if not (0.0 <= settings.temperature <= 2.0):
        errors.append(f"Invalid TEMPERATURE: {settings.temperature}. Must be between 0 and 2.")
    if settings.max_retries < 1:
        errors.append(f"Invalid MAX_RETRIES: {settings.max_retries}. Must be >= 1.")
    if errors:
        warnings.warn("Configuration issues:\n" + "\n".join(errors))

# Run validation at import time but do not raise (so tests/imports keep working)
_validate_config()
