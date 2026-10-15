# FastAPI + React Integration Guide

This guide explains how to run your SecureGuard spam/malware detection app with the FastAPI backend and React frontend.

## Architecture Overview

```
┌─────────────────────┐          ┌─────────────────────┐
│   React Frontend    │          │  FastAPI Backend    │
│   (Port 5173)       │  ◄────►  │   (Port 8000)       │
│                     │   HTTP   │                     │
│ - Landing Page      │  Requests│ - Authentication    │
│ - Auth Pages        │          │ - Detection API     │
│ - Dashboard         │          │ - Scan History      │
└─────────────────────┘          └─────────────────────┘
```

## Setup Instructions

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your SECRET_KEY (generate with: openssl rand -hex 32)

# Run the backend server
uvicorn main:app --reload --port 8000
```

The backend will be available at: `http://localhost:8000`
API documentation at: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)

In a **new terminal** (keep the backend running):

```bash
# Make sure you're in the root directory (not backend/)
cd ..  # if you're still in backend/

# Install dependencies (if not already done)
npm install

# The frontend is already configured to use the backend
# Check .env.local to confirm VITE_API_URL=http://localhost:8000

# Run the frontend
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### 3. Testing the Integration

1. **Open the app**: Navigate to `http://localhost:5173`
2. **Sign Up**: Create a new account
3. **Sign In**: Log in with your credentials
4. **Test Detection**: 
   - Try scanning some text (use the example spam messages)
   - Upload a file to test file scanning
5. **View History**: Check the History tab to see your scans

## How It Works

### Frontend → Backend Communication

The frontend uses the API service layer (`/src/app/services/api.ts`) to communicate with the backend:

```typescript
// Example: Text Analysis
const result = await apiService.analyzeText("Your text here");
```

### Fallback Mode

The app is configured with **automatic fallback** to mock data if the backend is unavailable:

- In `/src/app/utils/auth.ts` and `/src/app/utils/detection.ts`
- Set `USE_MOCK_DATA = true` to always use mock data
- Set `USE_MOCK_DATA = false` to use the API (with automatic fallback)

This means:
- ✅ App works even if backend is down (development mode)
- ✅ Seamless switch between mock and real API
- ✅ Console warnings show when fallback is used

### Authentication Flow

1. User signs up/signs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent API calls include token in headers
5. Backend validates token and returns data

## Switching Between Mock and Real API

### Always Use API (recommended for development):
```typescript
// In auth.ts and detection.ts
const USE_MOCK_DATA = false;
```

### Always Use Mock Data (for testing without backend):
```typescript
// In auth.ts and detection.ts
const USE_MOCK_DATA = true;
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Log in
- `GET /api/auth/me` - Get current user

### Detection
- `POST /api/detect/text` - Analyze text
- `POST /api/detect/file` - Analyze file metadata
- `POST /api/detect/file/upload` - Upload and scan file

### History
- `GET /api/scans/history` - Get scan history

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:

1. Check that backend is running on port 8000
2. Verify CORS configuration in `backend/main.py`
3. Make sure frontend URL is in `allow_origins` list

### Backend Connection Failed
If frontend can't connect to backend:

1. Ensure backend is running: `uvicorn main:app --reload --port 8000`
2. Check `.env.local` has correct API URL
3. Restart frontend dev server after changing `.env.local`
4. Check browser console for error messages

### Port Already in Use
If port 8000 or 5173 is already in use:

```bash
# Change backend port
uvicorn main:app --reload --port 8001

# Update frontend .env.local
VITE_API_URL=http://localhost:8001

# Change frontend port
npm run dev -- --port 5174
```

### Token Expired
JWT tokens expire after 30 minutes. If you see authentication errors:
- Sign out and sign in again
- Or increase `ACCESS_TOKEN_EXPIRE_MINUTES` in backend

## Production Deployment

### Backend Deployment

1. **Set environment variables**:
   ```bash
   SECRET_KEY=<secure-key>
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

2. **Use a production server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

3. **Add HTTPS**: Use nginx/Apache as reverse proxy with SSL

4. **Add database**: Replace in-memory storage with PostgreSQL/MySQL

### Frontend Deployment

1. **Update API URL**:
   ```
   VITE_API_URL=https://api.yourdomain.com
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Deploy** to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Your own server

### Security Checklist

- [ ] Change SECRET_KEY in backend
- [ ] Use HTTPS for all connections
- [ ] Update CORS origins to production domains only
- [ ] Add rate limiting to API
- [ ] Use a real database
- [ ] Enable security headers
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## Development Workflow

### Typical Development Session

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
npm run dev

# Now you can:
# - Edit React components → Hot reload
# - Edit Python code → Auto reload
# - Test integration in browser
```

### Adding New Features

1. **Backend**: Add endpoint in `main.py`
2. **Frontend**: Add API method in `api.ts`
3. **Frontend**: Use API method in components
4. **Test**: Verify in browser

## Additional Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **JWT Guide**: https://jwt.io/introduction

## Support

For questions or issues:
1. Check the browser console for errors
2. Check the backend terminal for errors
3. Review API documentation at `/docs`
4. Check this integration guide

---

**Note**: This setup uses in-memory storage for development. For production, integrate a proper database (PostgreSQL, MongoDB, etc.).
