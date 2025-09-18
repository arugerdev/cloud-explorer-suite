// API Configuration - Configurable backend URL
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://storage.aruger.dev/api',
  timeout: 10000,
};

export const getApiUrl = (endpoint: string) => `${API_CONFIG.baseURL}${endpoint}`;