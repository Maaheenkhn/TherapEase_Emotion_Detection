// Centralizes API calls to backend services.


import axios from 'axios';
import { API_BASE_URL } from './constants';

/**
 * Axios instance for making API requests.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Wrapper for GET requests.
 * @param {string} endpoint - API endpoint.
 * @returns {Promise} - Response data.
 */
export const get = async (endpoint) => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Wrapper for POST requests.
 * @param {string} endpoint - API endpoint.
 * @param {object} data - Data to send in the request body.
 * @returns {Promise} - Response data.
 */
export const post = async (endpoint, data) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

/**
 * Wrapper for DELETE requests.
 * @param {string} endpoint - API endpoint.
 * @returns {Promise} - Response data.
 */
export const remove = async (endpoint) => {
  const response = await apiClient.delete(endpoint);
  return response.data;
};

export default apiClient;
