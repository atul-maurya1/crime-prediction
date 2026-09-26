import api from './api';

export const predictionService = {
  createPrediction: async (data) => {
    const response = await api.post('/predictions', data);
    return response.data;
  },
  getPredictions: async (params) => {
    const response = await api.get('/predictions', { params });
    return response.data;
  },
  getPrediction: async (id) => {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  }
};
