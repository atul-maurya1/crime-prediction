import api from './api';

export const analyticsService = {
  getSummary: async (params) => {
    const response = await api.get('/analytics/summary', { params });
    return response.data;
  },
  getTrends: async (params) => {
    const response = await api.get('/analytics/trends', { params });
    return response.data;
  },
  getByType: async (params) => {
    const response = await api.get('/analytics/by-type', { params });
    return response.data;
  },
  getByLocation: async (params) => {
    const response = await api.get('/analytics/by-location', { params });
    return response.data;
  },
  getByTime: async (params) => {
    const response = await api.get('/analytics/by-time', { params });
    return response.data;
  },
  getSeverityAnalysis: async (params) => {
    const response = await api.get('/analytics/severity', { params });
    return response.data;
  }
};
