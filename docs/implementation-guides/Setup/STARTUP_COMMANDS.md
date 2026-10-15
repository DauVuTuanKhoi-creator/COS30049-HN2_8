# 🚀 Startup Commands Reference

Quick reference for starting your SecureGuard application.

## Option 1: Automated Scripts (Easiest)

### macOS/Linux
```bash
# Backend
chmod +x start-backend.sh
./start-backend.sh

# Frontend (in a new terminal)
npm run dev
```

### Windows
```bash
# Backend
start-backend.bat

# Frontend (in a new terminal)
npm run dev
```

## Option 2: Manual Commands

### Backend Startup

**macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Startup
```bash
# From project root (not backend/)
npm install
npm run dev
```

## Option 3: Without Virtual Environment

If you prefer not to use a virtual environment:

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
npm run dev
```

## 📍 Access Points

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 🛑 Stopping the Servers

Press `Ctrl+C` in each terminal window to stop the servers.

## 🔄 Restarting

Simply run the same startup commands again. No need to reinstall dependencies unless they've changed.

## ⚙️ Using Different Ports

### Backend on Different Port
```bash
# Start backend on port 8001
uvicorn main:app --reload --port 8001

# Update .env.local
VITE_API_URL=http://localhost:8001

# Restart frontend
npm run dev
```

### Frontend on Different Port
```bash
npm run dev -- --port 5174
```

## 🧪 Testing Individual Components

### Test Backend Only
```bash
cd backend
uvicorn main:app --reload --port 8000
# Visit http://localhost:8000/docs to test API
```

### Test Frontend Only (with Mock Data)
```bash
# Edit these files and set USE_MOCK_DATA = true:
# - src/app/utils/auth.ts
# - src/app/utils/detection.ts

npm run dev
# Frontend will work with mock data, no backend needed
```

## 🐛 Troubleshooting Commands

### Check if Ports are in Use

**macOS/Linux:**
```bash
lsof -i :8000  # Backend port
lsof -i :5173  # Frontend port
```

**Windows:**
```bash
netstat -ano | findstr :8000
netstat -ano | findstr :5173
```

### Kill Process on Port

**macOS/Linux:**
```bash
kill -9 $(lsof -ti:8000)
```

**Windows:**
```bash
# Find PID from netstat command above, then:
taskkill /PID <PID> /F
```

### Verify Python Installation
```bash
python --version  # Windows
python3 --version # macOS/Linux
```

### Verify Node Installation
```bash
node --version
npm --version
```

### Check if Backend is Running
```bash
curl http://localhost:8000/health
```

### Reinstall Dependencies

**Backend:**
```bash
cd backend
pip install --upgrade -r requirements.txt
```

**Frontend:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 First Time Setup

Complete first-time setup:

```bash
# 1. Install backend dependencies
cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cd ..

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env and set SECRET_KEY
cd ..

# 3. Install frontend dependencies
npm install

# 4. Configure frontend (already done via .env.local)

# 5. Start backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8000
# Keep this terminal open

# 6. Start frontend (new terminal)
npm run dev
```

## 🌟 Production Commands

### Build Frontend for Production
```bash
npm run build
# Output in /dist folder
```

### Run Backend in Production
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🔧 Development Tips

### Auto-reload
Both servers support auto-reload:
- **Backend**: Reloads when Python files change
- **Frontend**: Hot reloads when React files change

### Multiple Terminal Setup
Recommended terminal layout:
```
Terminal 1: Backend (cd backend && uvicorn ...)
Terminal 2: Frontend (npm run dev)
Terminal 3: Git commands, testing, etc.
```

### VS Code Tasks
Create `.vscode/tasks.json` for quick startup:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000",
      "isBackground": true
    },
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "npm run dev",
      "isBackground": true
    }
  ]
}
```

## 📱 Mobile Testing

To test on mobile devices on the same network:

### Find Your Local IP

**macOS/Linux:**
```bash
ifconfig | grep "inet "
# or
hostname -I
```

**Windows:**
```bash
ipconfig
```

### Start Servers with Network Access

**Backend:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
npm run dev -- --host 0.0.0.0
```

Then access from mobile:
- Frontend: `http://YOUR_IP:5173`
- Update `.env.local`: `VITE_API_URL=http://YOUR_IP:8000`

## 🎯 Quick Command Summary

| Action | Command |
|--------|---------|
| Start Backend | `cd backend && uvicorn main:app --reload --port 8000` |
| Start Frontend | `npm run dev` |
| Stop Server | `Ctrl+C` |
| API Docs | Open `http://localhost:8000/docs` |
| Frontend | Open `http://localhost:5173` |
| Health Check | `curl http://localhost:8000/health` |
| Install Backend | `cd backend && pip install -r requirements.txt` |
| Install Frontend | `npm install` |
| Build Frontend | `npm run build` |

## 📚 Additional Resources

- [QUICK_START.md](QUICK_START.md) - Step-by-step setup guide
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Detailed integration docs
- [backend/README.md](backend/README.md) - Backend-specific documentation

---

**Pro Tip**: Save these commands in a shell alias or function for even faster startup!

```bash
# Add to ~/.bashrc or ~/.zshrc
alias secureguard-backend="cd ~/path/to/project/backend && source venv/bin/activate && uvicorn main:app --reload --port 8000"
alias secureguard-frontend="cd ~/path/to/project && npm run dev"
```
