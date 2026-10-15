@echo off
REM Start Backend Script for Windows

echo 🚀 Starting SecureGuard Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo ✅ Python found
python --version
echo.

REM Navigate to backend directory
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
    echo.
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing/updating dependencies...
pip install -r requirements.txt

echo.
echo ✅ All dependencies installed
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  No .env file found. Creating from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env and set your SECRET_KEY
    echo    Generate one with: python -c "import secrets; print(secrets.token_hex(32))"
    echo.
)

REM Start the server
echo 🚀 Starting FastAPI server on http://localhost:8000
echo 📚 API docs will be at http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

uvicorn main:app --reload --port 8000
