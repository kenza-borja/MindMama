# HommieHelp

## 🎯 Overview

HommieHelp is an AI-powered meal planning assistant designed to reduce the mental load of household management. It uses advanced language models to:

- Generate personalized meal suggestions based on dietary preferences and time constraints
- Extract structured recipes from unstructured text
- Create consolidated shopping lists with intelligent ingredient aggregation
- Provide supportive, encouraging messages for daily planning

Built for the **Mom's Mental Load Hackathon**, this API serves as the backend for a comprehensive meal planning solution.

---

## ✨ Features

### 🤖 AI-Powered Meal Suggestions
- Generate recipes based on meal type, servings, time available, and dietary restrictions
- Personalized recommendations using GPT-4o-mini or Llama 3.1
- Context-aware suggestions with practical cooking instructions

### 📝 Recipe Extraction
- Convert unstructured recipe text into structured data
- Parse ingredients with quantities and cooking steps
- Handle recipes from websites, cookbooks, or manual entry

### 🛒 Smart Shopping Lists
- **Intelligent aggregation**: Combines quantities from multiple recipes
- **Ingredient normalization**: "vine tomatoes" → "tomato"
- **Unit standardization**: "tbsp" → "tablespoon"
- **Category organization**: Groups by produce, pantry, dairy, etc.
- **Duplicate elimination**: No redundant items

### 💬 Supportive Messaging
- Generate encouraging messages for meal planning
- Context-aware and genuinely helpful (not cheesy!)
- Acknowledges the mental load of household management

### 🔧 Robust Engineering
- Comprehensive error handling with retry logic
- Automatic JSON validation with Pydantic
- Extensive test coverage (14 tests passing)
- Interactive API documentation with Swagger UIg

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- OpenAI API key OR Groq API key (both work)

### API Key Options

**Option 1: Groq (Recommended for Development)**
- ✅ Completely free
- ✅ No credit card required
- ✅ Very fast inference
- 🔗 Get key: https://console.groq.com/

**Option 2: OpenAI**
- 💳 Requires credit card ($5 minimum)
- ✅ Most reliable for production
- ✅ Latest GPT models
- 🔗 Get key: https://platform.openai.com/api-keys



### Installation

1. **Clone this repository**
```bash
git clone 
cd HommieHelp
```

2. **Create virtual environment**
```bash
python -m venv venv

# On Mac/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your API key
# Get OpenAI key: https://platform.openai.com/api-keys
# OR get Groq key (free): https://console.groq.com/
```

5. **Run the server**
```bash
python main.py
```

6. **Test it!**
Open your browser to: `http://localhost:8000/docs`

You'll see interactive API documentation where you can test everything!

## 📁 Project Structure
```
HommieHelp/
│
├── src/                                    # Source code directory
│   ├── app/                                # Main application package
│   │   ├── __init__.py                     # Package initializer
│   │   ├── main.py                         # FastAPI application & endpoints
│   │   ├── config.py                       # Configuration settings
│   │   ├── models.py                       # Pydantic data models
│   │   └── prompts.py                      # AI prompt templates
│   │
│   ├── services/                           # Business logic & services
│   │   ├── __init__.py                     # Package initializer
│   │   ├── llm_client.py                   # OpenAI/Groq API wrapper
│   │   └── utils.py                        # Ingredient normalization & aggregation
│   │
│   ├── Data/                               # Data files
│   │   ├── IngredientCanonicalMap.json     # Ingredient name mappings
│   │   ├── UnitNormalizationMap.json       # Unit standardization rules
│   │   └── DummyIngredientData.csv         # Sample ingredient data
│   │
│   ├── tests/                              # Test suite
│   │   ├── test_api.py                     # API endpoint tests
│   │   └── test_connection.py              # Connection & setup tests
│   │
│   └── .env                                # Environment variables (API keys)
│
├── README.md                               # Project documentation
├── requirements.txt                        # Python dependencies
└── .venv/                                  # Virtual environment (not in repo)
```