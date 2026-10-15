#!/bin/bash
# Start Backend Script for macOS/Linux

echo "🚀 Starting SecureGuard Backend..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Navigate to backend directory
cd backend || exit

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Check if requirements are installed
echo "📦 Installing/updating dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ All dependencies installed"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and set your SECRET_KEY"
    echo "   Generate one with: openssl rand -hex 32"
    echo ""
fi

# Start the server
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo "📚 API docs will be at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

uvicorn main:app --reload --port 8000
