const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = { ...options.headers };
  
  // 🔥 Only add application/json if body exists AND is NOT FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const defaultOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
