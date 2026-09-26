from pydantic import BaseModel, Field
from typing import Optional, Dict, List

class PredictionRequest(BaseModel):
    city: str
    month: int = Field(..., ge=1, le=12)
    day_of_week: int = Field(..., ge=0, le=6)
    hour: int = Field(..., ge=0, le=23)
    severity: str = 'Medium'

class PredictionResponse(BaseModel):
    predictedCategory: str
    confidence: float
    modelVersion: str
    allProbabilities: Optional[Dict[str, float]] = None

class HealthResponse(BaseModel):
    status: str
    modelLoaded: bool
    version: str

class ModelInfoResponse(BaseModel):
    modelVersion: str
    algorithm: str
    accuracy: float
    features: List[str]
    crimeTypes: List[str]
    trainedAt: str

class RetrainResponse(BaseModel):
    success: bool
    message: str
    metrics: Optional[Dict] = None
