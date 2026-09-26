# Database Documentation

## Database: MongoDB

**Database Name:** `crime_prediction`

## Collections

### 1. Users

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | User's full name |
| email | String | Yes | Unique email address (indexed) |
| password | String | Yes | Bcrypt hashed password (select: false) |
| role | String | Yes | 'admin' or 'user' (default: 'user') |
| createdAt | Date | Auto | Timestamp of creation |
| updatedAt | Date | Auto | Timestamp of last update |

**Indexes:**
- `email` (unique)

### 2. Crimes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| crimeId | String | Yes | Unique crime identifier (e.g., CR-00001) |
| crimeType | String | Yes | Enum: Theft, Robbery, Burglary, Assault, Vandalism, Fraud, Cybercrime, Drug-related, Other |
| description | String | Yes | Brief description of the incident |
| date | Date | Yes | Date of the incident |
| time | String | Yes | Time in HH:MM format |
| location | String | Yes | Locality/area name |
| city | String | Yes | City name |
| state | String | Yes | State name |
| latitude | Number | Yes | GPS latitude |
| longitude | Number | Yes | GPS longitude |
| severity | String | Yes | Enum: Low, Medium, High, Critical |
| caseStatus | String | Yes | Enum: Under Investigation, Solved, Pending, Closed |
| reportingSource | String | Yes | Enum: Police Station, Online Portal, Emergency Call, Citizen Report, CCTV Surveillance |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

**Indexes:**
- `crimeId` (unique)
- `city` (single)
- `{ city: 1, crimeType: 1 }` (compound)
- `{ date: 1, city: 1 }` (compound)
- `{ date: 1, crimeType: 1 }` (compound)

### 3. Predictions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| inputFeatures | Object | Yes | Input data sent for prediction |
| predictedCategory | String | Yes | ML model's predicted crime category |
| confidence | Number | Yes | Confidence score (0-1) |
| modelVersion | String | Yes | Version of the model used |
| createdBy | ObjectId | Yes | Reference to User who created it |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

**Indexes:**
- `createdBy` (for user-specific prediction history)

## ER Diagram Description

```
USER (1) ----creates/manages----> (N) CRIME
USER (1) ----generates----------> (N) PREDICTION
PREDICTION ----based on---------> contextual crime data features
```

### Relationships:
1. **USER → CRIME**: An admin user can create, update, and delete multiple crime records
2. **USER → PREDICTION**: Any authenticated user can generate multiple predictions
3. **PREDICTION → Context**: Each prediction is based on spatio-temporal features (city, month, day, hour, severity) derived from historical crime patterns

## MongoDB Connection

```javascript
// Connection string
mongodb://localhost:27017/crime_prediction
```

## Aggregation Pipelines

The system uses MongoDB aggregation pipelines for analytics:

1. **Crime Trends**: Groups crimes by year/month for time-series analysis
2. **Crime by Type**: Groups and counts by crimeType
3. **Crime by Location**: Groups and counts by city
4. **Crime by Time**: Parses time field to categorize into time buckets
5. **Severity Analysis**: Groups and counts by severity level
6. **Summary Statistics**: Combines multiple aggregations for dashboard KPIs
