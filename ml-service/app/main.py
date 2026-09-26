from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os

from app.schemas import PredictionRequest, PredictionResponse, HealthResponse, ModelInfoResponse, RetrainResponse
from app.prediction import get_prediction
from app.model import predictor

app = FastAPI(title="Crime Prediction ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    predictor.load_model()

@app.get("/health", response_model=HealthResponse)
def health_check():
    metadata = predictor.get_info() or {}
    return HealthResponse(
        status="ok",
        modelLoaded=predictor.is_loaded,
        version=metadata.get("version", "unknown")
    )

@app.get("/model-info", response_model=ModelInfoResponse)
def model_info():
    if not predictor.is_loaded:
        raise HTTPException(status_code=404, detail="Model is not loaded.")
    
    metadata = predictor.get_info()
    return ModelInfoResponse(
        modelVersion=metadata.get("version", "unknown"),
        algorithm=metadata.get("algorithm", "unknown"),
        accuracy=metadata.get("accuracy", 0.0),
        features=metadata.get("features", []),
        crimeTypes=metadata.get("crime_types", []),
        trainedAt=metadata.get("trained_at", "unknown")
    )

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if not predictor.is_loaded:
        raise HTTPException(status_code=503, detail="Model is not loaded. Please wait for initialization or trigger retraining.")
    
    try:
        return get_prediction(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/retrain", response_model=RetrainResponse)
def retrain():
    # Call the train.py script
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'train.py'))
    try:
        result = subprocess.run(['python', script_path], capture_output=True, text=True, check=True)
        # Reload model after training
        predictor.load_model()
        return RetrainResponse(
            success=True,
            message="Model retrained successfully.",
            metrics={"output": result.stdout[-500:]}
        )
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {e.stderr}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
