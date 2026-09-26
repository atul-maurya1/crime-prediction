# Crime Prediction ML Service

This is the Machine Learning service for the Crime Prediction and Analysis System.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Train the model:
Make sure the dataset is at `../dataset/crime_data.csv`.
```bash
python train.py
```

3. Run the API server:
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

- `GET /health` - Service health status and model load state
- `GET /model-info` - Model metadata (accuracy, algorithm, etc.)
- `POST /predict` - Get predictions for given features
- `POST /retrain` - Trigger model retraining
