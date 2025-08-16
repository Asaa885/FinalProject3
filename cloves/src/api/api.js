// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",  // badilisha kama backend yako ipo sehemu nyingine
  // headers: {
  //   Authorization: "Bearer token_yako", // kama unatumia authentication
  // },
});

// Statistics API functions
export const statsAPI = {
  // Fetch clove station statistics
  getCloveStationStats: async () => {
    const response = await api.get('/clovestation/stats');
    return response.data;
  },

  // Fetch farmer statistics
  getFarmerStats: async () => {
    const response = await api.get('/farmer/stats');
    return response.data;
  },

  // Fetch payment statistics
  getPaymentStats: async () => {
    const response = await api.get('/payment/stats');
    return response.data;
  },

  // Fetch officer statistics
  getOfficerStats: async () => {
    const response = await api.get('/officer/stats');
    return response.data;
  },

  // Fetch clove firm statistics
  getCloveFirmStats: async () => {
    const response = await api.get('/clovefirm/stats');
    return response.data;
  },

  // Fetch all statistics at once
  getAllStats: async () => {
    const response = await api.get('/stats/all');
    return response.data;
  }
};

export default api;
