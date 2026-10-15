# SecureGuard: Spam and Malware Detection

SecureGuard is a cybersecurity project that detects harmful content in messages and files. The repository includes:

- A FastAPI backend for authentication, scanning endpoints, and scan history
- A React frontend for user interaction
- A machine learning workflow that trains spam and malware detection models from open datasets

This README is written so another student can reproduce the full environment, train models, and run predictions.

## 1. Project Goal

The project addresses two related cybersecurity tasks:

- Spam detection from message and email text
- Malware threat detection from file or process-related attributes

Why ML is used:

- Pattern-only rules are brittle and easy to evade
- ML models generalize better to unseen wording and feature combinations
- Trained models provide confidence-based decisions useful for risk scoring

## 2. Repository Structure

```text
group-project-spr-2026-grp2_7/
Γö£ΓöÇΓöÇ backend/
Γöé   Γö£ΓöÇΓöÇ ReadMe.md
Γöé   ΓööΓöÇΓöÇ webapp/
Γöé       Γö£ΓöÇΓöÇ main.py
Γöé       Γö£ΓöÇΓöÇ auth.py
Γöé       Γö£ΓöÇΓöÇ detection.py
Γöé       Γö£ΓöÇΓöÇ models.py
Γöé       Γö£ΓöÇΓöÇ requirements.txt
Γöé       ΓööΓöÇΓöÇ README.md
Γö£ΓöÇΓöÇ data/
Γöé   Γö£ΓöÇΓöÇ mail_data.csv
Γöé   Γö£ΓöÇΓöÇ emails.csv
Γöé   Γö£ΓöÇΓöÇ data-augmented.csv
Γöé   Γö£ΓöÇΓöÇ Malware dataset.csv
Γöé   Γö£ΓöÇΓöÇ model.ipynb
Γöé   ΓööΓöÇΓöÇ trained_models/
Γö£ΓöÇΓöÇ frontend/
ΓööΓöÇΓöÇ docs/
```

## 3. Prerequisites

- Python 3.11 or newer
- Node.js 20 or newer
- npm 10 or newer
- Git (optional, but recommended)

Recommended OS support:

- Windows 10/11
- macOS
- Linux

## 4. Environment Setup (Full Reproducible Steps)

Run commands from the repository root unless noted.

### 4.1 Backend setup

1. Enter backend app folder:

```bash
cd backend/webapp
```

2. Create virtual environment:

```bash
python -m venv .venv
```

3. Activate virtual environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# Windows CMD
.venv\Scripts\activate.bat

# macOS/Linux
source .venv/bin/activate
```

4. Install backend dependencies:

```bash
pip install -r requirements.txt
```

5. Start backend API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. Verify API:

- Health endpoint: http://localhost:8000/health
- Swagger docs: http://localhost:8000/docs

### 4.2 Frontend setup

Open another terminal from repository root:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL is shown by Vite (normally http://localhost:5173).

## 5. Dataset Overview and Collection Notes

The project uses open/public datasets in the data folder:

- mail_data.csv: SMS spam/ham text dataset
- emails.csv: email spam/ham text dataset
- data-augmented.csv: augmented multilingual spam dataset
- Malware dataset.csv: malware vs benign process/file behavior features

Collection and integration challenges that were handled in code:

- Label inconsistency across files (spam/ham vs 1/0) normalized to binary labels
- Different text schemas merged into one common format
- Missing numeric values in malware features imputed with median strategy
- Duplicate samples removed before training

## 6. Model Training Instructions (Detailed)

Models are trained in the notebook:

- data/model.ipynb

### 6.1 Start Jupyter

From repository root:

```bash
cd data
jupyter notebook
```

Open model.ipynb and run all cells in order.

### 6.2 What training does

- Loads and merges spam datasets
- Performs preprocessing and EDA
- Trains and compares two spam classifiers
- Trains malware classifier
- Runs KMeans clustering for unsupervised analysis
- Saves model artifacts

### 6.3 Key training parameters

- RANDOM_STATE = 42
- Spam train/test split = 80/20 (stratified)
- Malware train/test split = 80/20 (stratified)
- Spam candidate models:
	- Character n-gram TF-IDF + Logistic Regression
	- Word n-gram TF-IDF + Logistic Regression baseline
- Malware classifier:
	- RandomForestClassifier with 400 trees
- Clustering:
	- KMeans with 2 clusters and n_init=20

### 6.4 Training outputs

After training, these files are written to data/trained_models:

- spam_detector.joblib
- malware_detector.joblib
- model_metadata.json

## 7. Prediction Guide (Clear Usage)

You can perform predictions through notebook helper functions or API endpoints.

### 7.1 Notebook examples

From model.ipynb final cell:

```python
predict_spam([
		"Claim your free prize now!",
		"Reminder: project meeting moved to 3 PM."
])
```

Expected output: spam probability and predicted label for each message.

Malware example:

```python
predict_malware(X_test_malware.head(3))
```

Expected output: malware probability and predicted label.

### 7.2 API prediction flow

1. Register account:

```http
POST /api/auth/signup
```

2. Sign in and get bearer token:

```http
POST /api/auth/signin
```

3. Analyze text:

```http
POST /api/detect/text
Authorization: Bearer <token>
Content-Type: application/json

{
	"text": "Congratulations! You won a free prize. Click now!"
}
```

4. Analyze file metadata:

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

## 8. Validation and Testing

Backend smoke checks:

```bash
cd backend/webapp
python -m py_compile main.py auth.py detection.py models.py
```

Optional test dependencies:

```bash
pip install pytest httpx
pytest
```

## 9. Known Limitations and Future Improvements

- Backend detection endpoints are currently rule-based and can be upgraded to load saved ML artifacts for runtime scoring
- In-memory user storage should be replaced with a database for production
- Add model drift monitoring and scheduled retraining

## 10. Additional Documentation

Implementation and integration guides:

- docs/implementation-guides/README.md
- docs/implementation-guides/ARCHITECTURE.md
- artifacts/secureguard-docs/PROJECT_OVERVIEW.md
