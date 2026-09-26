import os
import json
import joblib
from typing import Dict, Tuple, Optional
from app.preprocessing import preprocess_input

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'crime_model.joblib')
METADATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'model_metadata.json')

class CrimePredictor:
    def __init__(self):
        self.model = None
        self.metadata = None
        self.load_model()
        
    def load_model(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(METADATA_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                with open(METADATA_PATH, 'r') as f:
                    self.metadata = json.load(f)
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None
                self.metadata = None
                
    @property
    def is_loaded(self) -> bool:
        return self.model is not None and self.metadata is not None
        
    def get_info(self) -> Optional[Dict]:
        return self.metadata
        
    def predict(self, features_dict: Dict) -> Tuple[str, float, Dict[str, float]]:
        if not self.is_loaded:
            raise RuntimeError("Model is not loaded")
            
        df = preprocess_input(features_dict)
        
        predicted_class = self.model.predict(df)[0]
        
        # Get probabilities if supported
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(df)[0]
            classes = self.model.classes_
            
            # Map classes to probabilities
            all_probs = {str(classes[i]): float(probs[i]) for i in range(len(classes))}
            confidence = float(all_probs.get(predicted_class, 0.0))
        else:
            confidence = 1.0
            all_probs = {predicted_class: 1.0}
            
        return predicted_class, confidence, all_probs

predictor = CrimePredictor()
