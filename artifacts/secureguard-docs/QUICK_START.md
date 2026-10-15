# 🚀 Quick Start Guide

Get your SecureGuard app running in 5 minutes!

## ⚡ Fast Setup

### Step 1: Start the Backend (2 minutes)

```bash
# Open a terminal
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the backend
uvicorn main:app --reload --port 8000
```

✅ Backend running at: http://localhost:8000

### Step 2: Start the Frontend (1 minute)

```bash
# Open a NEW terminal (keep backend running)
# Go back to root directory if you're in backend/
cd ..

# Install npm dependencies (if not done)
npm install

# Run the frontend
npm run dev
```

✅ Frontend running at: http://localhost:5173

### Step 3: Test the App (2 minutes)

1. **Open** http://localhost:5173 in your browser
2. **Sign Up** with any email/password (minimum 6 characters)
3. **Try scanning**:
   - Click "Use Example" to load spam text
   - Click "Scan Text" to see detection in action
4. **Upload a file** to test file scanning

## 🎉 That's It!

You now have a fully functional spam/malware detection app with:
- ✅ React frontend
- ✅ FastAPI backend
- ✅ JWT authentication
- ✅ Real-time detection
- ✅ Scan history

## 📝 Current Mode

**The app uses MOCK DATA by default** for easy testing. The backend is ready but the frontend will fallback to mock data if the backend isn't running.

To ensure it uses the API:
1. Make sure backend is running
2. Check console for "API ... failed, using mock" messages
3. If you see those, the backend may not be running or there's a connection issue

## 🛠️ Troubleshooting

**Backend won't start?**
```bash
# Make sure you're in the backend directory
cd backend

# Check Python version (need 3.8+)
python --version

# Try installing dependencies again
pip install -r requirements.txt
```

**Frontend won't start?**
```bash
# Make sure you're in the root directory (not backend/)
pwd  # Should show your project root

# Clean install
rm -rf node_modules
npm install
npm run dev
```

**Can't access the app?**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs

## 📚 Next Steps

- Read `INTEGRATION_GUIDE.md` for detailed information
- Check `backend/README.md` for backend documentation
- Explore the API docs at http://localhost:8000/docs

## 🔧 Configuration

### Switch to Real API Mode

Edit these files and set `USE_MOCK_DATA = false`:
- `/src/app/utils/auth.ts`
- `/src/app/utils/detection.ts`

### Change Ports

**Backend:**
```bash
uvicorn main:app --reload --port 8001
```
Then update `.env.local`: `VITE_API_URL=http://localhost:8001`

**Frontend:**
```bash
npm run dev -- --port 5174
```

## 💡 Pro Tips

1. **Keep both terminals open** while developing
2. **Use the API docs** at `/docs` to test endpoints
3. **Check browser console** for helpful debug messages
4. **Backend auto-reloads** when you edit Python files
5. **Frontend hot-reloads** when you edit React files

---

**Need help?** Check the `INTEGRATION_GUIDE.md` for detailed troubleshooting!
