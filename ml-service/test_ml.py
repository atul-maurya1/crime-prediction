import os
import unittest
import pandas as pd
from app.preprocessing import extract_features, preprocess_input
from app.model import CrimePredictor

class TestMLService(unittest.TestCase):
    def test_preprocessing(self):
        sample_data = {
            "city": "Lucknow",
            "month": 8,
            "day_of_week": 4,
            "hour": 21,
            "severity": "Medium"
        }
        df = preprocess_input(sample_data)
        self.assertIsInstance(df, pd.DataFrame)
        self.assertEqual(df.shape[0], 1)
        self.assertEqual(df['city'].iloc[0], "Lucknow")

    def test_model_loaded(self):
        predictor = CrimePredictor()
        # Should correctly detect if joblib model exists
        self.assertIsNotNone(predictor)

if __name__ == '__main__':
    unittest.main()
