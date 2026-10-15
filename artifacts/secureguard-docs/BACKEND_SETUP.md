# FastAPI Backend Setup Guide

This document contains the FastAPI backend code that you need to run separately from the React frontend.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation Steps

1. **Create a new directory for your backend**
   ```bash
   mkdir secureguard-backend
   cd secureguard-backend
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install required packages**
   ```bash
   pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-multipart pydantic pydantic-settings
   ```

4. **Create the following files** (see code below):
   - `main.py` - Main FastAPI application
   - `models.py` - Pydantic models
   - `detection.py` - Detection algorithms
   - `auth.py` - Authentication utilities
   - `.env` - Environment variables

## Running the Backend

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API documentation will be at `http://localhost:8000/docs`

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (Vite dev server).
If you deploy to production, update the CORS origins in `main.py`.

## Environment Variables

Create a `.env` file with:

```
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Generate a secure secret key with:
```bash
openssl rand -hex 32
```

## Connecting Frontend to Backend

In your React app, set the API URL by creating a `.env` file in the frontend root:

```
VITE_API_URL=http://localhost:8000
```

## File Structure

```
secureguard-backend/
├── main.py           # FastAPI application
├── models.py         # Pydantic models
├── detection.py      # Detection algorithms
├── auth.py           # Authentication utilities
├── .env              # Environment variables
└── requirements.txt  # Python dependencies
```

---

## Code Files

### requirements.txt
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
pydantic==2.10.0
pydantic-settings==2.6.0
```

See the other files in this repository for complete implementation code.
