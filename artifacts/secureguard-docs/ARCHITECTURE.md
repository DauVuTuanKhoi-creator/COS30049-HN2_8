# 🏗️ System Architecture

## Overview

SecureGuard is a full-stack spam and malware detection application with a React frontend and FastAPI backend.

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    http://localhost:5173                        │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 │ HTTP/HTTPS Requests
                 │ (JSON API)
                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite)                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Landing   │  │    Auth     │  │  Dashboard  │           │
│  │    Page     │  │   Pages     │  │             │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │           API Service Layer (api.ts)              │         │
│  │  • Authentication requests                        │         │
│  │  • Detection requests                             │         │
│  │  • History requests                               │         │
│  │  • Automatic token management                     │         │
│  └──────────────────────────────────────────────────┘         │
│                         │                                       │
│                         │ Fallback to Mock Data                │
│                         │ (if API unavailable)                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │      Utils (auth.ts, detection.ts)               │         │
│  │  • Mock implementations for development           │         │
│  │  • Automatic fallback logic                       │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 │ JWT Bearer Token
                 │ + JSON Payloads
                 ▼
┌────────────────────────────────────────────────────────────────┐
│                 FASTAPI BACKEND (Python)                        │
│                   http://localhost:8000                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │              main.py (Routes)                     │         │
│  │  ┌────────────────────────────────────────────┐  │         │
│  │  │  Auth Endpoints:                           │  │         │
│  │  │  • POST /api/auth/signup                   │  │         │
│  │  │  • POST /api/auth/signin                   │  │         │
│  │  │  • GET  /api/auth/me                       │  │         │
│  │  └────────────────────────────────────────────┘  │         │
│  │                                                    │         │
│  │  ┌────────────────────────────────────────────┐  │         │
│  │  │  Detection Endpoints:                      │  │         │
│  │  │  • POST /api/detect/text                   │  │         │
│  │  │  • POST /api/detect/file                   │  │         │
│  │  │  • POST /api/detect/file/upload            │  │         │
│  │  └────────────────────────────────────────────┘  │         │
│  │                                                    │         │
│  │  ┌────────────────────────────────────────────┐  │         │
│  │  │  History Endpoints:                        │  │         │
│  │  │  • GET  /api/scans/history                 │  │         │
│  │  └────────────────────────────────────────────┘  │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │         auth.py (Authentication)                  │         │
│  │  • JWT token generation & validation              │         │
│  │  • Password hashing (bcrypt)                      │         │
│  │  • Token expiration handling                      │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │       detection.py (Detection Engine)             │         │
│  │  • Spam pattern matching                          │         │
│  │  • Malware signature detection                    │         │
│  │  • Risk scoring algorithms                        │         │
│  │  • File metadata analysis                         │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │         models.py (Data Models)                   │         │
│  │  • Pydantic schemas for validation                │         │
│  │  • Request/Response models                        │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │      In-Memory Storage (Development)              │         │
│  │  • users_db: {email -> user_data}                 │         │
│  │  • scan_history_db: {user_id -> [scans]}          │         │
│  │                                                    │         │
│  │  ⚠️  Replace with real database in production     │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User Sign Up/Sign In
         │
         ▼
Frontend Form Validation
         │
         ▼
POST /api/auth/signup or /api/auth/signin
         │
         ▼
Backend Password Validation
         │
         ▼
Generate JWT Token (HS256)
         │
         ▼
Return {access_token, user}
         │
         ▼
Frontend stores token in localStorage
         │
         ▼
Token included in all subsequent requests
```

### 2. Text Detection Flow

```
User Enters Text
         │
         ▼
Click "Scan Text"
         │
         ▼
POST /api/detect/text
         │
         ▼
Backend: analyze_text_content()
         │
         ├─► Check spam patterns
         ├─► Check malware patterns
         ├─► Check suspicious URLs
         ├─► Calculate risk score
         └─► Determine threat level
         │
         ▼
Return DetectionResult
         │
         ▼
Frontend displays results
         │
         ▼
Save to scan history
```

### 3. File Detection Flow

```
User Selects File
         │
         ▼
Click "Scan File"
         │
         ▼
POST /api/detect/file (metadata)
or
POST /api/detect/file/upload (full file)
         │
         ▼
Backend: analyze_file_metadata()
         │
         ├─► Check file extension
         ├─► Check file size
         ├─► Check filename patterns
         ├─► Detect double extensions
         └─► Calculate malware score
         │
         ▼
Return DetectionResult
         │
         ▼
Frontend displays results
         │
         ▼
Save to scan history
```

## Security Architecture

### Authentication
```
┌─────────────────────────────────────────┐
│         JWT Authentication              │
├─────────────────────────────────────────┤
│                                         │
│  1. User Login                          │
│     ↓                                   │
│  2. Verify Credentials                  │
│     ↓                                   │
│  3. Generate JWT Token                  │
│     • Payload: {sub: email, exp: time}  │
│     • Signed with SECRET_KEY            │
│     • Algorithm: HS256                  │
│     ↓                                   │
│  4. Return Token to Client              │
│     ↓                                   │
│  5. Client Stores Token                 │
│     • localStorage: auth_token          │
│     ↓                                   │
│  6. Include Token in Requests           │
│     • Header: Authorization: Bearer ... │
│     ↓                                   │
│  7. Backend Validates Token             │
│     • Verify signature                  │
│     • Check expiration                  │
│     • Extract user info                 │
│                                         │
└─────────────────────────────────────────┘
```

### Password Security
- **Hashing**: bcrypt with automatic salting
- **Validation**: Minimum 6 characters (increase in production)
- **Storage**: Only hashed passwords stored, never plain text

### Token Security
- **Expiration**: 30 minutes (configurable)
- **Secret Key**: Must be changed in production
- **Algorithm**: HS256 (HMAC with SHA-256)

## Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **Routing**: React Router 7.13.0
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI 0.115.0
- **Server**: Uvicorn 0.32.0
- **Authentication**: python-jose (JWT)
- **Password Hashing**: passlib with bcrypt
- **Validation**: Pydantic 2.10.0
- **Language**: Python 3.8+

## Component Structure

### Frontend Components
```
/src
├── /app
│   ├── App.tsx                 # Main app component
│   ├── routes.ts              # React Router configuration
│   │
│   ├── /pages
│   │   ├── Landing.tsx        # Landing page
│   │   ├── SignIn.tsx         # Sign in page
│   │   ├── SignUp.tsx         # Sign up page
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   └── NotFound.tsx       # 404 page
│   │
│   ├── /components
│   │   ├── DetectionCard.tsx  # Results display
│   │   ├── ScanExamples.tsx   # Example content
│   │   └── /ui                # UI components
│   │
│   ├── /services
│   │   └── api.ts             # API service layer
│   │
│   └── /utils
│       ├── auth.ts            # Auth utilities
│       └── detection.ts       # Detection utilities
│
└── /styles
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

### Backend Structure
```
/backend
├── main.py              # FastAPI app & routes
├── models.py            # Pydantic models
├── auth.py              # JWT authentication
├── detection.py         # Detection algorithms
├── requirements.txt     # Python dependencies
└── .env                # Environment variables
```

## API Design

### RESTful Principles
- **Resource-based URLs**: `/api/detect/text`, `/api/auth/signin`
- **HTTP Methods**: POST for creation/actions, GET for retrieval
- **Status Codes**: 200 (success), 401 (unauthorized), 400 (bad request)
- **JSON Format**: All requests/responses use JSON

### Request/Response Format
```json
// Request
{
  "text": "Content to analyze"
}

// Response
{
  "isSpam": true,
  "isMalware": false,
  "confidence": 0.87,
  "threatLevel": "high",
  "reasons": ["Content matches known spam patterns"],
  "details": {
    "suspiciousPatterns": ["Spam keyword detected: \"WIN\""],
    "riskFactors": ["Excessive use of capital letters"],
    "safetyScore": 13
  }
}
```

## Deployment Architecture

### Development
```
Frontend (Vite Dev)  ←→  Backend (Uvicorn)
localhost:5173          localhost:8000
```

### Production (Recommended)
```
┌─────────────────────┐
│   CDN / Edge Cache  │  (Frontend Assets)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Load Balancer      │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌─────────┐
│ API     │  │ API     │  (FastAPI instances)
│ Server  │  │ Server  │
└────┬────┘  └────┬────┘
     │            │
     └─────┬──────┘
           ▼
    ┌────────────┐
    │  Database  │  (PostgreSQL/MySQL)
    └────────────┘
```

## Future Enhancements

### Scalability
- Add database for persistence
- Implement caching (Redis)
- Add message queue (Celery/RabbitMQ)
- Horizontal scaling with load balancer

### Features
- Machine learning models
- Real-time scanning
- Email integration
- Bulk file scanning
- Advanced threat intelligence
- User roles and permissions
- Webhook notifications

### Security
- Rate limiting
- API key authentication option
- OAuth2 integration
- Audit logging
- Encryption at rest

---

For more information, see:
- `QUICK_START.md` - Get up and running fast
- `INTEGRATION_GUIDE.md` - Detailed integration guide
- `backend/README.md` - Backend documentation
