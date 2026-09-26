import React, { useState, useEffect } from 'react';
import { predictionService } from '../services/predictionService';
import { CITIES, DAY_NAMES, MONTH_NAMES, SEVERITIES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { Brain, AlertCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/helpers';

const PredictionPage = () => {
  const [formData, setFormData] = useState({
    city: '',
    month: new Date().getMonth() + 1,
    dayOfWeek: new Date().getDay(),
    hour: new Date().getHours(),
    severity: 'Medium'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await predictionService.getPredictions({ limit: 10 });
      setHistory(res.data?.predictions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'city' || name === 'severity' ? value : parseInt(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.city) {
      toast.error('Please select a city');
      return;
    }
    setLoading(true);
    setResult(null);
    
    try {
      const res = await predictionService.createPrediction(formData);
      setResult(res.data);
      fetchHistory();
      toast.success('Prediction generated successfully');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to generate prediction. Is the ML service running?';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Convert allProbabilities object to sorted array for display
  const getProbabilityBars = () => {
    if (!result?.allProbabilities) return [];
    // allProbabilities might be stored in inputFeatures or directly on result
    // The ML response has allProbabilities but Prediction model stores specific fields
    // We'll try to show what we have
    return [];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crime Category Prediction</h1>
        <p className="mt-2 text-sm text-gray-600">
          Uses machine learning models trained on historical reported crime data to estimate the most likely crime category for given spatio-temporal conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prediction Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-600" />
            Input Parameters
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select name="city" required value={formData.city} onChange={handleChange} className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select City</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select name="month" required value={formData.month} onChange={handleChange} className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                <select name="dayOfWeek" required value={formData.dayOfWeek} onChange={handleChange} className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hour of Day</label>
                <select name="hour" required value={formData.hour} onChange={handleChange} className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {Array.from({length: 24}).map((_, i) => (
                    <option key={i} value={i}>{`${i.toString().padStart(2, '0')}:00`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity Context</label>
                <select name="severity" required value={formData.severity} onChange={handleChange} className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.city}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Analyzing Data...
                </span>
              ) : 'Generate Prediction'}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Prediction Result
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LoadingSpinner />
              <p className="mt-4 text-sm text-gray-500 animate-pulse">Running ML model...</p>
            </div>
          ) : result ? (
            <div className="space-y-5">
              {/* Main Result */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center border border-blue-100">
                <p className="text-sm font-medium text-blue-700 uppercase tracking-wider">Predicted Crime Category</p>
                <p className="mt-2 text-3xl font-extrabold text-blue-900">{result.predictedCategory}</p>
                
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-xs">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(result.confidence || 0) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {((result.confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Confidence Score</p>
              </div>

              {/* Input Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Input Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">City:</span> <span className="font-medium">{result.inputFeatures?.city}</span></div>
                  <div><span className="text-gray-500">Month:</span> <span className="font-medium">{MONTH_NAMES[(result.inputFeatures?.month || 1) - 1]}</span></div>
                  <div><span className="text-gray-500">Day:</span> <span className="font-medium">{DAY_NAMES[result.inputFeatures?.dayOfWeek || 0]}</span></div>
                  <div><span className="text-gray-500">Hour:</span> <span className="font-medium">{String(result.inputFeatures?.hour || 0).padStart(2, '0')}:00</span></div>
                  <div><span className="text-gray-500">Severity:</span> <span className="font-medium">{result.inputFeatures?.severity}</span></div>
                  <div><span className="text-gray-500">Model:</span> <span className="font-medium">v{result.modelVersion}</span></div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  <strong>Disclaimer:</strong> This prediction is a statistical estimate based on historical reported crime data. 
                  It does not indicate that a specific person or area will commit a crime, and should not be used as a basis 
                  for individual decisions. Historical data may contain reporting and sampling biases.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Brain className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-sm">Configure parameters and run prediction</p>
            </div>
          )}
        </div>
      </div>

      {/* Prediction History */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Prediction History</h3>
        </div>
        {historyLoading ? (
          <div className="p-8"><LoadingSpinner /></div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No predictions yet. Generate your first prediction above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Input</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Predicted Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{item.inputFeatures?.city}</div>
                      <div className="text-xs text-gray-500">
                        {MONTH_NAMES[(item.inputFeatures?.month || 1) - 1]}, 
                        {' '}{DAY_NAMES[item.inputFeatures?.dayOfWeek || 0]}, 
                        {' '}{String(item.inputFeatures?.hour || 0).padStart(2, '0')}:00
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full">
                        {item.predictedCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {((item.confidence || 0) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      v{item.modelVersion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
