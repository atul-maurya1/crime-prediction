import os
import json
import datetime
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix

def main():
    print("Starting training process...")
    
    # 1. Load dataset
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_path = os.path.join(base_dir, 'dataset', 'crime_data.csv')
    
    if not os.path.exists(dataset_path):
        # Create a dummy dataset just for the script to run successfully if missing
        print(f"Dataset not found at {dataset_path}. Please place the file there.")
        return
        
    print(f"Loading data from {dataset_path}...")
    df = pd.read_csv(dataset_path)
    
    # 2. Validate columns
    required_cols = ['crimeId', 'crimeType', 'description', 'date', 'time', 'location', 'city', 'state', 'latitude', 'longitude', 'severity']
    for col in required_cols:
        if col not in df.columns:
            print(f"Missing required column: {col}")
            return
            
    # 3. Clean data
    df = df.dropna(subset=['crimeType', 'date', 'time', 'city', 'severity']).copy()
    
    # 4. Extract features
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day_of_week'] = df['date'].dt.dayofweek
    
    # Process time - dataset uses HH:MM format
    df['hour'] = df['time'].astype(str).str.split(':').str[0].astype(int)

    # 5. Target variable
    y = df['crimeType']
    
    # 6. Features
    feature_cols = ['month', 'day_of_week', 'hour', 'city', 'severity']
    X = df[feature_cols]
    
    print(f"Dataset shape after preprocessing: {X.shape}")
    
    # 7. ColumnTransformer
    categorical_features = ['city', 'severity']
    numerical_features = ['month', 'day_of_week', 'hour']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )
    
    # 8. Train test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 9. Train THREE models
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Decision Tree': DecisionTreeClassifier(random_state=42),
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42)
    }
    
    results = {}
    best_model_name = None
    best_accuracy = 0
    best_pipeline = None
    
    print("\nTraining and evaluating models...")
    # 10 & 11. Evaluate models
    for name, model in models.items():
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', model)
        ])
        
        print(f"\n--- {name} ---")
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        
        results[name] = {
            'accuracy': acc,
            'precision': prec,
            'recall': rec,
            'f1_score': f1
        }
        
        print(f"Accuracy:  {acc:.4f}")
        print(f"Precision: {prec:.4f}")
        print(f"Recall:    {rec:.4f}")
        print(f"F1-score:  {f1:.4f}")
        
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, zero_division=0))
        
        print("Confusion Matrix:")
        print(confusion_matrix(y_test, y_pred))
        
        # 12. Select BEST model
        if acc > best_accuracy:
            best_accuracy = acc
            best_model_name = name
            best_pipeline = pipeline
            
    print("\n===============================")
    print("Summary of Results:")
    for name, metrics in results.items():
        print(f"{name}: Accuracy = {metrics['accuracy']:.4f}")
        
    print(f"\nBest model selected: {best_model_name} with accuracy {best_accuracy:.4f}")
    
    # 14. Save pipeline
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'crime_model.joblib')
    joblib.dump(best_pipeline, model_path)
    print(f"\nSaved best model pipeline to {model_path}")
    
    # 15. Save metadata
    metadata = {
        "version": "1.0",
        "algorithm": best_model_name,
        "accuracy": best_accuracy,
        "features": feature_cols,
        "crime_types": sorted(list(y.unique())),
        "trained_at": datetime.datetime.now().isoformat()
    }
    
    metadata_path = os.path.join(models_dir, 'model_metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    print(f"Saved model metadata to {metadata_path}")
    print("Training complete.")

if __name__ == "__main__":
    main()
