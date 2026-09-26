# Machine Learning Documentation

## Overview

The Machine Learning (ML) service is a standalone Python application powered by **FastAPI** and **Scikit-Learn**. It processes historical spatio-temporal crime data to predict the statistical likelihood of crime categories (`crimeType`) under specific non-personal environmental contexts.

> [!IMPORTANT]
> **Ethical ML Compliance**:
> The model uses **strictly non-personal context features** (City, Month, Day of Week, Hour of Day, Severity Level). It **does not** utilize personal identifiable information (PII), names, phone numbers, addresses, race, religion, or facial features.

---

## 1. Feature Engineering & Preprocessing

### Input Features (`X`)

| Feature | Type | Encoding / Transformation | Description |
|---------|------|----------------------------|-------------|
| `city` | Categorical | One-Hot Encoding (`OneHotEncoder`) | Indian Metropolitan Cities (e.g. Delhi, Mumbai, Lucknow) |
| `severity` | Categorical | One-Hot Encoding (`OneHotEncoder`) | Severity rating (Low, Medium, High, Critical) |
| `month` | Numerical | Passthrough | Month of year (1 - 12) |
| `day_of_week` | Numerical | Passthrough | Day of week (0 = Sunday, ..., 6 = Saturday) |
| `hour` | Numerical | Passthrough | Hour of day in 24h format (0 - 23) |

### Target Variable (`y`)
- `crimeType`: Multi-class classification target (Theft, Robbery, Burglary, Assault, Vandalism, Fraud, Cybercrime, Drug-related, Other).

---

## 2. Pipeline & Model Architecture

The training pipeline is constructed using `scikit-learn.pipeline.Pipeline` combined with a `ColumnTransformer`:

```python
preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', ['month', 'day_of_week', 'hour']),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), ['city', 'severity'])
    ]
)

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', ModelInstance)
])
```

### Models Compared
1. **Random Forest Classifier** (`n_estimators=100`, `random_state=42`)
2. **Decision Tree Classifier** (`random_state=42`)
3. **Logistic Regression** (`max_iter=1000`, `random_state=42`)

The model with the highest test accuracy is automatically selected, serialized using `joblib`, and saved to `ml-service/models/crime_model.joblib`.

---

## 3. Training & Evaluation Metrics

The script `ml-service/train.py` executes an 80/20 train-test split (`test_size=0.2`) and outputs:
- **Accuracy Score**
- **Weighted Precision, Recall, and F1-Score**
- **Classification Report** per crime category
- **Confusion Matrix**

Artifacts generated:
- `ml-service/models/crime_model.joblib`: Serialized Scikit-Learn Pipeline
- `ml-service/models/model_metadata.json`: Metadata containing algorithm type, accuracy, feature names, crime categories, and timestamp.

---

## 4. FastAPI Endpoints

### Health Check
- `GET /health` -> Returns service availability, model load status, and model version.

### Model Metadata
- `GET /model-info` -> Returns details regarding trained algorithm, accuracy metric, and feature names.

### Generate Prediction
- `POST /predict`
  - **Request Body**:
    ```json
    {
      "city": "Lucknow",
      "month": 8,
      "day_of_week": 4,
      "hour": 21,
      "severity": "Medium"
    }
    ```
  - **Response**:
    ```json
    {
      "predictedCategory": "Theft",
      "confidence": 0.35,
      "modelVersion": "1.0",
      "allProbabilities": {
        "Theft": 0.35,
        "Robbery": 0.20,
        "Burglary": 0.15
      }
    }
    ```

### Retrain Model
- `POST /retrain` -> Triggers full execution of `train.py` asynchronously and reloads the model pipeline into memory.
