from app.schemas import PredictionRequest, PredictionResponse
from app.model import predictor

def get_prediction(request: PredictionRequest) -> PredictionResponse:
    if not predictor.is_loaded:
        raise RuntimeError("Model is not loaded or missing.")
        
    features_dict = request.model_dump()
    
    predicted_category, confidence, all_probs = predictor.predict(features_dict)
    
    metadata = predictor.get_info() or {}
    version = metadata.get("version", "unknown")
    
    return PredictionResponse(
        predictedCategory=predicted_category,
        confidence=confidence,
        modelVersion=version,
        allProbabilities=all_probs
    )
