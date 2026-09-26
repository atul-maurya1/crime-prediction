import api from './api';

export const reportService = {
  exportCrimesCSV: async (params) => {
    const response = await api.get('/reports/crimes.csv', { 
      params, 
      responseType: 'blob' 
    });
    return response.data;
  }
};
