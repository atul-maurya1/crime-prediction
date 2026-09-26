# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format

All API responses follow this format:

### Success
```json
{
  "success": true,
  "message": "Description of success",
  "data": { ... },
  "error": null
}
```

### Error
```json
{
  "success": false,
  "message": "Description of error",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error message"
  }
}
```

---

## Authentication

### Register
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123"
}
```

### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "admin@crimeanalysis.org",
  "password": "Admin@123456"
}
```
**Response:** Sets HTTP-only cookie `token` and returns user data with JWT token.

### Logout
```
POST /api/auth/logout
```
Clears the authentication cookie.

### Get Current User
```
GET /api/auth/me
```
**Auth Required:** Yes

---

## Crime Records

### Get All Crimes
```
GET /api/crimes
```
**Auth Required:** Yes

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Records per page (default: 10) |
| search | string | Search by crimeId, city, or crimeType |
| crimeType | string | Filter by crime type |
| city | string | Filter by city |
| state | string | Filter by state |
| severity | string | Filter by severity |
| caseStatus | string | Filter by case status |
| startDate | string | Filter start date (YYYY-MM-DD) |
| endDate | string | Filter end date (YYYY-MM-DD) |

### Get Single Crime
```
GET /api/crimes/:id
```
**Auth Required:** Yes

### Create Crime
```
POST /api/crimes
```
**Auth Required:** Yes (Admin only)

**Body:**
```json
{
  "crimeType": "Theft",
  "description": "Mobile phone stolen from crowded area",
  "date": "2024-03-15",
  "time": "14:30",
  "location": "Connaught Place",
  "city": "Delhi",
  "state": "Delhi",
  "latitude": 28.6315,
  "longitude": 77.2167,
  "severity": "Medium",
  "caseStatus": "Under Investigation",
  "reportingSource": "Police Station"
}
```

### Update Crime
```
PUT /api/crimes/:id
```
**Auth Required:** Yes (Admin only)

### Delete Crime
```
DELETE /api/crimes/:id
```
**Auth Required:** Yes (Admin only)

---

## Analytics

All analytics endpoints support query filters: `city`, `crimeType`, `startDate`, `endDate`

### Summary
```
GET /api/analytics/summary
```
Returns: totalCrimes, thisMonthCrimes, openCases, closedCases, mostCommonType, topLocation

### Trends
```
GET /api/analytics/trends
```
Returns: Monthly crime counts grouped by year/month

### By Type
```
GET /api/analytics/by-type
```
Returns: Crime counts grouped by type

### By Location
```
GET /api/analytics/by-location
```
Returns: Crime counts grouped by city

### By Time
```
GET /api/analytics/by-time
```
Returns: Crime counts by time buckets (Morning, Afternoon, Evening, Night)

### Severity Analysis
```
GET /api/analytics/severity
```
Returns: Crime counts grouped by severity level

---

## Predictions

### Create Prediction
```
POST /api/predictions
```
**Auth Required:** Yes

**Body:**
```json
{
  "city": "Delhi",
  "month": 8,
  "day_of_week": 4,
  "hour": 21,
  "severity": "Medium"
}
```

### Get Predictions (History)
```
GET /api/predictions
```
**Auth Required:** Yes

### Get Single Prediction
```
GET /api/predictions/:id
```
**Auth Required:** Yes

---

## Reports

### Export Crimes CSV
```
GET /api/reports/crimes.csv
```
**Auth Required:** Yes

Supports same filters as GET /api/crimes

---

## User Management (Admin Only)

### Get All Users
```
GET /api/users
```
**Auth Required:** Yes (Admin only)

### Update User Role
```
PUT /api/users/:id/role
```
**Auth Required:** Yes (Admin only)

**Body:**
```json
{
  "role": "admin"
}
```

### Delete User
```
DELETE /api/users/:id
```
**Auth Required:** Yes (Admin only)

---

## ML Service API (Internal)

### Health Check
```
GET http://localhost:8000/health
```

### Model Info
```
GET http://localhost:8000/model-info
```

### Predict
```
POST http://localhost:8000/predict
```
**Body:**
```json
{
  "city": "Delhi",
  "month": 8,
  "day_of_week": 4,
  "hour": 21,
  "severity": "Medium"
}
```

### Retrain
```
POST http://localhost:8000/retrain
```
