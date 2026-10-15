# SecureGuard FastAPI Backend

This is the FastAPI backend for the SecureGuard spam and malware detection application.

## Features

- **Authentication**: JWT-based user authentication with password hashing
- **Text Analysis**: Detects spam patterns in text content
- **File Analysis**: Analyzes file metadata for malware indicators
- **Scan History**: Tracks user scan history
- **RESTful API**: Clean API design with automatic documentation

## Quick Start

### 1. Install Dependencies

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Generate a secure secret key
openssl rand -hex 32

# Edit .env and add your secret key
```

### 3. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## Dataset and Model Training Link

This backend is part of a full ML workflow in the repository:

- Datasets are stored in `data/`
- Training notebook is `data/model.ipynb`
- Saved model artifacts are written to `data/trained_models/`

Training workflow summary:

1. Open `data/model.ipynb`
2. Run all cells in sequence
3. Confirm artifacts exist:
     - `data/trained_models/spam_detector.joblib`
     - `data/trained_models/malware_detector.joblib`
     - `data/trained_models/model_metadata.json`

Current backend endpoints use pattern-based detection (`detection.py`). The trained artifacts are prepared for ML integration in a future extension.

## Notebook (ipynb) Dependency Installation

Use the same Python virtual environment so backend and notebook tooling stay consistent.

1. Activate your backend virtual environment:

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

2. Install Jupyter + ML packages required by `data/model.ipynb`:

```bash
pip install jupyter notebook ipykernel pandas numpy scikit-learn matplotlib joblib
```

3. Register the environment as a notebook kernel (recommended):

```bash
python -m ipykernel install --user --name secureguard-ml --display-name "Python (secureguard-ml)"
```

4. Launch Jupyter and select the `Python (secureguard-ml)` kernel:

```bash
cd ../../data
jupyter notebook
```

If your kernel does not appear in Jupyter, restart Jupyter after running the `ipykernel install` command.

## Reproducible Training Commands

From repository root:

```bash
cd data
jupyter notebook
```

Then open `model.ipynb` and run all cells. Key parameters are set inside the notebook:

- `RANDOM_STATE = 42`
- `USE_MULTILINGUAL_AUGMENTATION = False`

Training includes:

- Spam model comparison (two candidate classifiers)
- Malware classifier training (RandomForest)
- Malware clustering analysis (KMeans)

## Prediction Guide

### Predict via API

1. Create account and sign in:

- `POST /api/auth/signup`
- `POST /api/auth/signin`

2. Use returned bearer token for detection routes:

- `POST /api/detect/text`
- `POST /api/detect/file`
- `POST /api/detect/file/upload`

### Example text scan request

```bash
curl -X POST "http://localhost:8000/api/detect/text" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"text":"Congratulations! You won a free prize. Click now!"}'
```

### Example file metadata scan request

```bash
curl -X POST "http://localhost:8000/api/detect/file" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"file_name":"invoice.exe","file_size":50234,"file_type":"application/octet-stream"}'
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in existing user
- `GET /api/auth/me` - Get current user info (requires auth)

### Detection

- `POST /api/detect/text` - Analyze text content
- `POST /api/detect/file` - Analyze file metadata
- `POST /api/detect/file/upload` - Upload and scan a file

### Scan History

- `GET /api/scans/history` - Get user's scan history

### Health

- `GET /health` - API health check

## Project Structure

```
backend/
├── main.py           # FastAPI application and routes
├── models.py         # Pydantic models for validation
├── auth.py           # Authentication utilities (JWT)
├── detection.py      # Detection algorithms
├── requirements.txt  # Python dependencies
├── .env.example      # Environment variables template
└── README.md         # This file
```

## Security Notes

⚠️ **Important for Production:**

1. **Change the SECRET_KEY**: Generate a secure key and never commit it to version control
2. **Use a real database**: The current implementation uses in-memory storage
3. **Enable HTTPS**: Use SSL/TLS in production
4. **Rate limiting**: Add rate limiting to prevent abuse
5. **Input validation**: Already implemented with Pydantic
6. **CORS**: Update allowed origins for your production domain

## Integration with Frontend

The React frontend expects the API at `http://localhost:8000` by default.

To connect the frontend:

1. Create a `.env` file in your frontend root:
   ```
   VITE_API_URL=http://localhost:8000
   ```

2. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn main:app --reload --port 8000
   
   # Terminal 2 - Frontend
   cd ../
   npm run dev
   ```

## Development

### Adding New Detection Patterns

Edit `detection.py` to add new spam or malware patterns:

```python
SPAM_PATTERNS = [
    r'\b(your|new|pattern)\b',
    # Add more patterns...
]
```

### Database Integration

To add a real database (PostgreSQL, MySQL, etc.):

1. Install database driver: `pip install sqlalchemy psycopg2-binary`
2. Create database models
3. Replace in-memory dictionaries with database queries

### Machine Learning Integration

To integrate ML models:

1. Train your model (scikit-learn, TensorFlow, PyTorch, etc.)
2. Save the model
3. Load and use in `detection.py`

Example:
```python
import joblib

model = joblib.load('spam_classifier.pkl')

def analyze_text_ml(text: str) -> float:
    features = extract_features(text)
    return model.predict_proba([features])[0][1]
```

## Testing

```bash
# Install test dependencies
pip install pytest httpx

# Run tests
pytest
```

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t secureguard-api .
docker run -p 8000:8000 secureguard-api
```

### Cloud Platforms

- **Heroku**: Use `Procfile` with `web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-8000}`
- **AWS Lambda**: Use Mangum adapter for serverless deployment
- **Google Cloud Run**: Deploy Docker container
- **DigitalOcean App Platform**: Connect GitHub repo and deploy

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.
