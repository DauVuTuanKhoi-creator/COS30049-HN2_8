# SecureGuard: Spam and Malware Detection Platform

SecureGuard is a full-stack cybersecurity project for analyzing suspicious text and files. The latest version combines:

- a React + Vite frontend with public product pages, authentication, and an interactive dashboard
- a FastAPI backend with JWT authentication, scan history, and detection endpoints
- a machine learning workflow that trains and saves reusable spam and malware artifacts from open datasets

This README is updated to match the current repository structure and runtime behavior so another student can reproduce the environment, run the app, and retrain the models if needed.

## 1. Project Overview

SecureGuard focuses on two related cybersecurity tasks:

- spam detection for suspicious emails and messages
- malware risk detection for uploaded files and file metadata

The project now supports a complete local workflow:

1. create an account and sign in
2. submit text or files for analysis
3. review threat scores and scan explanations
4. inspect recent scan history in the dashboard
5. retrain the notebook models from the datasets in the data folder

## 2. Current Features

### Frontend

- landing, product, security, docs, and support pages
- sign up and sign in flows
- dashboard sections for Overview, Scanner, Scan History, Threat Intel, Reports, and Settings
- API integration with the FastAPI backend

### Backend

- JWT-based authentication with password hashing
- protected endpoints for text analysis, file analysis, and file upload scanning
- in-memory user and scan-history storage for local development
- health endpoint and interactive Swagger documentation

### Detection behavior

- text analysis uses a trained spam model when the artifact is available in the trained models folder
- if the trained spam model cannot be loaded, the backend falls back to heuristic pattern scoring
- file analysis checks dangerous extensions, double extensions, archive signatures, executable headers, suspicious keywords, and risky embedded content

## 3. Repository Structure

```text
group-project-spr-2026-grp2_7/
├── backend/
│   ├── ReadMe.md
│   └── webapp/
│       ├── auth.py
│       ├── detection.py
│       ├── main.py
│       ├── models.py
│       ├── requirements.txt
│       ├── start-backend.bat
│       ├── start-backend.sh
│       └── README.md
├── data/
│   ├── data-augmented.csv
│   ├── emails.csv
│   ├── mail_data.csv
│   ├── mail_dataset.csv
│   ├── Malwaredataset.csv
│   ├── model.ipynb
│   ├── reports/
│   └── trained_models/
├── frontend/
│   ├── package.json
│   └── src/
└── docs/
```

## 4. Tech Stack

### Application

- React 18 + TypeScript + Vite
- Tailwind CSS and Radix UI components
- FastAPI + Pydantic v2 + Uvicorn
- JWT authentication and bcrypt password hashing

### Data and ML

- Jupyter Notebook
- pandas and numpy
- scikit-learn
- joblib for model persistence

## 5. Prerequisites

Install the following before running the project:

- Python 3.11 or newer recommended
- Node.js 20 or newer
- npm 10 or newer
- Git optional but recommended

Supported local environments:

- Windows 10/11
- macOS
- Linux

## 6. Local Setup

Run commands from the repository root unless noted otherwise.

### 6.1 Backend setup

```bash
cd backend/webapp
python -m venv .venv
```

Activate the environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# Windows CMD
.venv\Scripts\activate.bat

# macOS/Linux
source .venv/bin/activate
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Optional helper scripts are also included in the same folder for Windows and shell-based startup.

### 6.2 Frontend setup

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses the backend URL from the Vite environment variable if provided, and otherwise defaults to http://localhost:8000.

### 6.3 Local URLs

- frontend app: http://localhost:5173
- backend API: http://localhost:8000
- health check: http://localhost:8000/health
- Swagger docs: http://localhost:8000/docs

## 7. API Overview

### Authentication

- POST /api/auth/signup
- POST /api/auth/signin
- GET /api/auth/me

### Detection

- POST /api/detect/text
- POST /api/detect/file
- POST /api/detect/file/upload

### History

- GET /api/scans/history

## 8. Example Usage

### 8.1 Analyze text

```http
POST /api/detect/text
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Congratulations! You won a free prize. Click now!"
}
```

### 8.2 Analyze file metadata

```http
POST /api/detect/file
Authorization: Bearer <token>
Content-Type: application/json

{
  "file_name": "invoice.exe",
  "file_size": 50234,
  "file_type": "application/octet-stream"
}
```

### 8.3 Upload and scan a file

```bash
curl -X POST "http://localhost:8000/api/detect/file/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@suspicious_attachment.exe"
```

## 9. Dataset and Training Workflow

The notebook in the data folder prepares and trains the project models.

Main datasets currently included:

- mail_data.csv for spam and ham text samples
- emails.csv for email classification samples
- data-augmented.csv for augmented spam content
- Malwaredataset.csv for malware-related behavior and file attributes

### Start Jupyter

```bash
cd data
jupyter notebook
```

Then open model.ipynb and run all cells in order.

### Training workflow summary

- merges and normalizes spam datasets
- performs preprocessing and exploratory analysis
- trains and compares spam classifiers
- trains a malware classifier and clustering workflow
- writes model artifacts to the trained models folder

### Expected artifacts

After training, the notebook writes:

- spam_detector.joblib
- malware_detector.joblib
- model_metadata.json

Note: the current backend runtime directly loads the spam model artifact for text analysis. File scanning remains primarily heuristic/rule-based in this version.

## 10. Validation and Smoke Checks

### Backend syntax check

```bash
cd backend/webapp
python -m py_compile main.py auth.py detection.py models.py
```

### Frontend production build check

```bash
cd frontend
npm run build
```

### Optional testing tools

```bash
pip install pytest httpx
pytest
```

## 11. Current Limitations

- user accounts and scan history are stored in memory and reset when the backend restarts
- the backend currently uses a development secret key in code and should be moved to environment configuration for production
- file analysis is intended for risk scoring and educational demonstration, not full antivirus sandboxing
- the trained malware artifact is generated by the notebook but is not yet fully wired into live backend scoring

## 12. Additional Documentation

For more detail, see:

- [docs/implementation-guides/README.md](docs/implementation-guides/README.md)
- [docs/implementation-guides/Setup/QUICK_START.md](docs/implementation-guides/Setup/QUICK_START.md)
- [docs/implementation-guides/Structure/ARCHITECTURE.md](docs/implementation-guides/Structure/ARCHITECTURE.md)
- [artifacts/secureguard-docs/PROJECT_OVERVIEW.md](artifacts/secureguard-docs/PROJECT_OVERVIEW.md)
