# 🛡️ SecureGuard - Spam & Malware Detection App

A comprehensive full-stack application for detecting spam and malware threats in text messages and files. Built with React (frontend) and FastAPI (backend).

![Tech Stack](https://img.shields.io/badge/React-18.3.1-blue)
![Tech Stack](https://img.shields.io/badge/FastAPI-0.115.0-green)
![Tech Stack](https://img.shields.io/badge/TypeScript-Latest-blue)
![Tech Stack](https://img.shields.io/badge/Python-3.8+-yellow)

## 📚 Documentation

**New to this project?** Start here: **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete guide to all documentation

**Quick Links:**
- 🚀 **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
- 📖 **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Detailed setup and troubleshooting
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- 💻 **[STARTUP_COMMANDS.md](STARTUP_COMMANDS.md)** - Command reference
- 📊 **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Feature overview

## ✨ Features

### 🔐 Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- User registration and login
- Protected routes and API endpoints

### 📝 Text Analysis
- Pattern-based spam detection
- Malicious code detection
- Suspicious URL identification
- Risk factor analysis
- Confidence scoring

### 📁 File Scanning
- File metadata analysis
- Extension-based threat detection
- File size validation
- Double extension detection
- Phishing filename detection

### 📊 Dashboard
- Real-time scanning interface
- Scan history tracking
- Statistics and metrics
- Security tips
- Example content for testing

### 🎨 UI/UX
- Modern, clean cybersecurity aesthetic
- Responsive design
- Dark theme
- Interactive components
- Loading states and animations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd secureguard

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

📖 **See [QUICK_START.md](QUICK_START.md) for detailed instructions.**

## 📁 Project Structure

```
secureguard/
├── src/                      # React frontend
│   ├── app/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API service layer
│   │   └── utils/           # Utility functions
│   └── styles/              # CSS and Tailwind
│
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── models.py           # Pydantic models
│   ├── auth.py             # Authentication
│   ├── detection.py        # Detection algorithms
│   └── requirements.txt    # Python dependencies
│
├── QUICK_START.md          # Quick start guide
├── INTEGRATION_GUIDE.md    # Detailed integration docs
├── ARCHITECTURE.md         # System architecture
└── README.md              # This file
```

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Radix UI** - Component primitives
- **Lucide React** - Icons

### Backend
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **python-jose** - JWT handling
- **passlib** - Password hashing

## 🔧 Configuration

### Frontend Environment Variables
Create `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

### Backend Environment Variables
Copy `backend/.env.example` to `backend/.env`:
```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Generate a secure key:
```bash
openssl rand -hex 32
```

## 🧪 Testing

### Frontend
```bash
npm run dev
```

### Backend
```bash
cd backend
uvicorn main:app --reload
```

Access API documentation at http://localhost:8000/docs

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user

### Detection
- `POST /api/detect/text` - Analyze text
- `POST /api/detect/file` - Analyze file metadata
- `POST /api/detect/file/upload` - Upload and scan file

### History
- `GET /api/scans/history` - Get scan history

## 🔐 Security Features

- JWT token-based authentication
- Bcrypt password hashing
- CORS protection
- Request validation with Pydantic
- Secure token storage
- Automatic token expiration

## 🚀 Deployment

### Backend
- Deploy to: Heroku, AWS Lambda, Google Cloud Run, DigitalOcean
- Use environment variables for secrets
- Add a production database (PostgreSQL recommended)
- Enable HTTPS
- Set up monitoring

### Frontend
- Deploy to: Vercel, Netlify, AWS S3, Cloudflare Pages
- Update `VITE_API_URL` to production backend URL
- Build: `npm run build`

## 🔍 Detection Algorithms

### Text Analysis
- Spam keyword detection
- Malware pattern matching
- URL analysis
- Capital letter ratio
- Exclamation mark frequency
- Monetary amount detection

### File Analysis
- Dangerous extension detection
- Compressed file warnings
- Double extension detection
- Suspicious filename patterns
- File size validation

## 🎯 Use Cases

- Email spam filtering
- Malware detection
- Phishing prevention
- File security scanning
- Content moderation
- Security auditing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with FastAPI and React
- UI components from Radix UI
- Icons from Lucide
- Styled with Tailwind CSS

## 📧 Support

For questions or issues, please:
1. Check the [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
2. Review the [QUICK_START.md](QUICK_START.md)
3. Check API docs at http://localhost:8000/docs
4. Open an issue on GitHub

---

**Note**: This is a development version using in-memory storage. For production use, integrate a proper database and follow the security checklist in [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md).

Made with ❤️ for digital security