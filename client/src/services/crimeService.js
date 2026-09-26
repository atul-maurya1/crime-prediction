import api from './api';

export const crimeService = {
  getCrimes: async (params) => {
    const response = await api.get('/crimes', { params });
    return response.data;
  },
  getCrime: async (id) => {
    const response = await api.get(`/crimes/${id}`);
    return response.data;
  },
  createCrime: async (data) => {
    const response = await api.post('/crimes', data);
    return response.data;
  },
  updateCrime: async (id, data) => {
    const response = await api.put(`/crimes/${id}`, data);
    return response.data;
  },
  deleteCrime: async (id) => {
    const response = await api.delete(`/crimes/${id}`);
    return response.data;
  }
};
