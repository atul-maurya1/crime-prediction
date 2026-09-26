import pandas as pd
from typing import Dict, Any

def load_dataset(filepath: str) -> pd.DataFrame:
    df = pd.read_csv(filepath)
    required_cols = ['crimeType', 'date', 'time', 'city', 'severity']
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
    return df

def extract_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    
    # Extract temporal features if needed, but train.py might already do this
    # Assuming date is YYYY-MM-DD and time is HH:MM or similar
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.month
        df['day_of_week'] = df['date'].dt.dayofweek
    
    if 'time' in df.columns:
        # Simple extraction if time is string HH:MM...
        df['time'] = pd.to_datetime(df['time'], format='%H:%M:%S', errors='ignore')
        # Handle cases where pd.to_datetime converts to actual datetime object with today's date
        if hasattr(df['time'].dt, 'hour'):
            df['hour'] = df['time'].dt.hour
        else:
            # Fallback to string split if it's purely a string HH:MM
            df['hour'] = df['time'].astype(str).str.split(':').str[0].astype(int)

    # Return required columns if available
    features = ['month', 'day_of_week', 'hour', 'city', 'severity']
    available_features = [f for f in features if f in df.columns]
    
    return df[available_features]

def preprocess_input(data: Dict[str, Any]) -> pd.DataFrame:
    # Just convert dict to DataFrame. The pipeline handles standardizing and one-hot encoding
    return pd.DataFrame([data])
