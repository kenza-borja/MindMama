"""
Quick connection test script
Run this to verify your setup before starting the server
Usage: python test_connection.py
"""

import os
import sys
from dotenv import load_dotenv

def print_status(message, status="info"):
    """Print colored status messages"""
    colors = {
        "success": "\033[92m✓",
        "error": "\033[91m✗",
        "info": "\033[94mℹ",
        "warning": "\033[93m⚠"
    }
    reset = "\033[0m"
    symbol = colors.get(status, colors["info"])
    print(f"{symbol} {message}{reset}")


def check_python_version():
    """Check if Python version is sufficient"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 9:
        print_status(f"Python {version.major}.{version.minor}.{version.micro} detected", "success")
        return True
    else:
        print_status(f"Python {version.major}.{version.minor} is too old. Need 3.9+", "error")
        return False


def check_dependencies():
    """Check if required packages are installed"""
    required = ["fastapi", "uvicorn", "pydantic", "dotenv"]
    optional = ["openai", "groq"]
    
    all_good = True
    
    print("\nChecking required packages:")
    for package in required:
        try:
            __import__(package)
            print_status(f"{package} installed", "success")
        except ImportError:
            print_status(f"{package} not found", "error")
            all_good = False
    
    print("\nChecking LLM providers:")
    has_provider = False
    for package in optional:
        try:
            __import__(package)
            print_status(f"{package} installed", "success")
            has_provider = True
        except ImportError:
            print_status(f"{package} not found (optional)", "warning")
    
    if not has_provider:
        print_status("No LLM provider installed! Install openai or groq", "error")
        all_good = False
    
    return all_good


def check_env_file():
    """Check if .env file exists and has API keys"""
    if not os.path.exists(".env"):
        print_status(".env file not found", "error")
        print("   Run: cp .env.example .env")
        return False
    
    print_status(".env file exists", "success")
    
    load_dotenv()
    
    openai_key = os.getenv("OPENAI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    
    if not openai_key and not groq_key:
        print_status("No API key found in .env", "error")
        print("   Add either OPENAI_API_KEY or GROQ_API_KEY to .env file")
        return False
    
    if openai_key:
        if openai_key.startswith("sk-"):
            print_status("OpenAI API key found", "success")
        else:
            print_status("OpenAI API key format looks wrong", "warning")
            print("   OpenAI keys should start with 'sk-'")
    
    if groq_key:
        if groq_key.startswith("gsk_"):
            print_status("Groq API key found", "success")
        else:
            print_status("Groq API key format looks wrong", "warning")
            print("   Groq keys should start with 'gsk_'")
    
    return True


def test_llm_connection():
    """Test actual connection to LLM"""
    print("\nTesting LLM connection...")
    
    try:
        from src.services.llm_client import LLMClient
        
        client = LLMClient()
        print_status(f"Using provider: {client.provider}", "info")
        print_status(f"Using model: {client.model}", "info")
        
        # Simple test
        result = client.test_connection()
        
        if result:
            print_status("LLM connection successful!", "success")
            return True
        else:
            print_status("LLM connection failed", "error")
            return False
            
    except Exception as e:
        print_status(f"Connection test failed: {str(e)}", "error")
        return False


def test_imports():
    """Test that all modules can be imported"""
    print("\nTesting module imports:")
    modules = ["main", "models", "prompts", "llm_client", "config", "utils"]
    
    all_good = True
    for module in modules:
        try:
            __import__(module)
            print_status(f"{module}.py imports successfully", "success")
        except Exception as e:
            print_status(f"{module}.py import failed: {str(e)}", "error")
            all_good = False
    
    return all_good


def main():
    """Run all checks"""
    print("=" * 60)
    print("🔍 AI Orchestrator Connection Test")
    print("=" * 60)
    
    checks = []
    
    # Run checks
    print("\n1. Checking Python version...")
    checks.append(check_python_version())
    
    print("\n2. Checking dependencies...")
    checks.append(check_dependencies())
    
    print("\n3. Checking environment configuration...")
    checks.append(check_env_file())
    
    print("\n4. Testing module imports...")
    checks.append(test_imports())
    
    print("\n5. Testing LLM connection...")
    checks.append(test_llm_connection())
    
    # Summary
    print("\n" + "=" * 60)
    if all(checks):
        print_status("ALL CHECKS PASSED! ✨", "success")
        print("\nYou're ready to start the server:")
        print("  python main.py")
        print("\nThen visit:")
        print("  http://localhost:8000/docs")
    else:
        print_status("SOME CHECKS FAILED ⚠️", "warning")
        print("\nPlease fix the errors above before starting the server.")
        print("\nCommon fixes:")
        print("  - Install dependencies: pip install -r requirements.txt")
        print("  - Create .env file: cp .env.example .env")
        print("  - Add your API key to .env file")
    print("=" * 60)
    
    return all(checks)


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)