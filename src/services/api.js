import axios from 'axios';

const API_URL = 'https://fruit-classifier-backend-production.up.railway.app/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Image classification API calls
const classifyImage = async (formData, modelType = 'fruit_classifier', onUploadProgress) => {
  return apiClient.post(`/classify?model_type=${modelType}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

// Get classification results
const getResults = async (filename, modelType = 'fruit_classifier') => {
  return apiClient.get(`/results/${filename}?model_type=${modelType}`);
};

// Get classification history
const getHistory = async () => {
  return apiClient.get('/history');
};

// Export all API functions
const apiService = {
  classifyImage,
  getResults,
  getHistory,
};

export default apiService;