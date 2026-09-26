# Crime Dataset

## ⚠️ Important Notice

**This dataset contains SYNTHETIC (artificially generated) data created for academic and development purposes only.**

This data does NOT represent real crime statistics, real locations of criminal activity, or real events. It was generated using randomized parameters to provide a realistic distribution for testing the Crime Prediction and Analysis System.

## Dataset Details

| Field | Description |
|-------|-------------|
| `crimeId` | Unique identifier (e.g., CR-00001) |
| `crimeType` | Category of crime (Theft, Robbery, Burglary, Assault, Vandalism, Fraud, Cybercrime, Drug-related, Other) |
| `description` | Brief description of the incident |
| `date` | Date of reported incident (YYYY-MM-DD) |
| `time` | Time of reported incident (HH:MM) |
| `location` | Locality/area name |
| `city` | City name |
| `state` | State name |
| `latitude` | GPS latitude coordinate |
| `longitude` | GPS longitude coordinate |
| `severity` | Severity level (Low, Medium, High, Critical) |
| `caseStatus` | Current case status (Under Investigation, Solved, Pending, Closed) |
| `reportingSource` | Source of report (Police Station, Online Portal, Emergency Call, Citizen Report, CCTV Surveillance) |

## Statistics

- **Total Records**: 1,200
- **Date Range**: January 2022 – December 2024
- **Cities**: 10 major Indian cities
- **Crime Types**: 9 categories

## Using a Real Dataset

To replace this synthetic dataset with a legitimate public dataset:

1. **NCRB Data**: Download from [National Crime Records Bureau](https://ncrb.gov.in/)
2. **Kaggle Datasets**: Search for "India crime dataset" on [Kaggle](https://kaggle.com)
3. **data.gov.in**: Find open government crime data at [data.gov.in](https://data.gov.in)

### Steps to Replace:
1. Download the real dataset in CSV format
2. Map the columns to match the schema above
3. Rename the file to `crime_data.csv` and place it in this directory
4. Re-run the ML training script: `python ml-service/train.py`
5. Re-run the seed script if importing into MongoDB: `npm run seed`

### Important Considerations:
- Verify the dataset's license allows academic use
- Document the source, date of collection, and any known biases
- Real crime data may contain reporting and sampling biases
- Not all crimes are reported; the data represents reported crimes only
- Do not use the data to make claims about specific individuals or communities

## License

This synthetic dataset is provided under MIT License for educational purposes only.
