"""
FastAPI Backend for SecureGuard Spam & Malware Detection App
Main application entry point
"""

from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from pathlib import Path
from typing import List, Optional
import json
import re

from models import (
    SignUpRequest,
    SignInRequest,
    AuthResponse,
    User,
    TextAnalysisRequest,
    FileAnalysisRequest,
    DetectionResult,
    ScanHistoryItem
)
from auth import (
    create_access_token,
    verify_password,
    get_password_hash,
    verify_token
)
from detection import analyze_text_content, analyze_file_metadata

# Constants kept near imports so execution-critical parameters are easy to audit.
EMAIL_PATTERN = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
MAX_UPLOAD_BYTES = 100 * 1024 * 1024
MAX_HISTORY_ITEMS = 50
STATE_FILE_PATH = Path(__file__).resolve().parent / "app_state.json"
DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

# Initialize FastAPI app
app = FastAPI(
    title="SecureGuard API",
    description="Spam and Malware Detection API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=DEFAULT_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_auth_header(request: Request, call_next):
    print("Authorization:", request.headers.get("authorization"))
    return await call_next(request)

# Security
security = HTTPBearer(auto_error=False)

users_db = {}  # email -> user data
scan_history_db = {}  # user_id -> list of scans


# Helper Functions
def save_app_state() -> None:
    """Write the current in-memory auth and scan state to disk."""
    STATE_FILE_PATH.write_text(
        json.dumps(
            {
                "users_db": users_db,
                "scan_history_db": scan_history_db,
            },
            indent=2,
        ),
        encoding="utf-8",
    )


def load_app_state() -> None:
    """Restore auth and scan state from disk when the backend starts."""
    global users_db, scan_history_db

    if not STATE_FILE_PATH.exists():
        users_db = {}
        scan_history_db = {}
        return

    try:
        raw_state = json.loads(STATE_FILE_PATH.read_text(encoding="utf-8"))
        users_db = raw_state.get("users_db", {}) or {}
        scan_history_db = raw_state.get("scan_history_db", {}) or {}
    except (OSError, json.JSONDecodeError):
        users_db = {}
        scan_history_db = {}


def append_scan_history(user_id: str, scan_type: str, result: DetectionResult, preview: str) -> None:
    """Persist one scan entry in memory with a predictable schema."""
    user_history = scan_history_db.setdefault(user_id, [])
    scan_id = f"scan_{len(user_history) + 1}"
    user_history.append({
        "id": scan_id,
        "type": scan_type,
        "timestamp": datetime.utcnow().isoformat(),
        "result": result.model_dump(),
        "preview": preview,
    })
    save_app_state()


load_app_state()


def is_valid_email(email: str) -> bool:
    """Centralized email validation used by signup flow."""
    return bool(re.match(EMAIL_PATTERN, email))


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> User:
    """Verify JWT token and return current user."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token. Sign in again and include Authorization: Bearer <token>.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub")
    if email is None or email not in users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    user_data = users_db[email]
    return User(
        id=user_data["id"],
        email=user_data["email"],
        name=user_data["name"]
    )


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[User]:
    """Return the signed-in user when present; otherwise allow anonymous scans."""
    if credentials is None:
        return None

    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        return None

    email = payload.get("sub")
    if email is None or email not in users_db:
        return None

    user_data = users_db[email]
    return User(
        id=user_data["id"],
        email=user_data["email"],
        name=user_data["name"]
    )


# Health Check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "SecureGuard API is running",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/activity/ping/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def activity_ping(session_id: str) -> Response:
    """Accept keepalive pings without polluting logs with 404 responses."""
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Authentication Endpoints
@app.post("/api/auth/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest):
    """Register a new user"""
    # Validation is explicit so API clients get deterministic error responses.
    if not is_valid_email(request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    # Check if user already exists
    if request.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate password
    if len(request.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
    # Create user
    user_id = f"user_{len(users_db) + 1}"
    hashed_password = get_password_hash(request.password)
    
    users_db[request.email] = {
        "id": user_id,
        "email": request.email,
        "name": request.name,
        "password": hashed_password
    }
    
    # Initialize scan history
    scan_history_db[user_id] = []
    save_app_state()

    # Create access token
    access_token = create_access_token(data={"sub": request.email})
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=User(
            id=user_id,
            email=request.email,
            name=request.name
        )
    )


@app.post("/api/auth/signin", response_model=AuthResponse)
async def signin(request: SignInRequest):
    """Sign in an existing user"""
    # Check if user exists
    if request.email not in users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user_data = users_db[request.email]
    
    # Verify password
    if not verify_password(request.password, user_data["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": request.email})
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=User(
            id=user_data["id"],
            email=user_data["email"],
            name=user_data["name"]
        )
    )


@app.get("/api/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user


# Detection Endpoints
@app.post("/api/detect/text", response_model=DetectionResult)
async def detect_text(
    request: TextAnalysisRequest,
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Analyze text content for spam and malware."""
    if not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text content cannot be empty"
        )

    result = analyze_text_content(request.text)

    if current_user is not None:
        preview = request.text[:50] + "..." if len(request.text) > 50 else request.text
        append_scan_history(current_user.id, "text", result, preview)

    return result


@app.post("/api/detect/file", response_model=DetectionResult)
async def detect_file(
    request: FileAnalysisRequest,
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Analyze file metadata for malware indicators."""
    result = analyze_file_metadata(
        request.file_name,
        request.file_size,
        request.file_type
    )

    if current_user is not None:
        append_scan_history(current_user.id, "file", result, request.file_name)

    return result


@app.post("/api/detect/file/upload", response_model=DetectionResult)
async def upload_file_for_scan(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Upload and scan a file."""
    # Get file metadata
    file_size = 0
    content = await file.read()
    file_size = len(content)
    
    # Bound upload size to avoid memory pressure in this in-memory demo backend.
    if file_size > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum limit of 100MB"
        )
    
    # Perform detection
    result = analyze_file_metadata(
        file.filename or "unknown",
        file_size,
        file.content_type or "application/octet-stream",
        file_content=content,
    )
    
    if current_user is not None:
        append_scan_history(current_user.id, "file", result, file.filename or "unknown")

    return result


@app.get("/api/scans/history", response_model=List[ScanHistoryItem])
async def get_scan_history(current_user: User = Depends(get_current_user)):
    """Get scan history for current user"""
    history = scan_history_db.get(current_user.id, [])
    
    # Return most recent scans first
    return sorted(
        [ScanHistoryItem(**scan) for scan in history],
        key=lambda x: x.timestamp,
        reverse=True
    )[:MAX_HISTORY_ITEMS]  # Return latest entries only


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SecureGuard API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
