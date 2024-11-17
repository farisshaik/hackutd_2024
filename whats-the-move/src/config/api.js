const config = {
    googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    apiUrl: process.env.REACT_APP_API_URL || 'https://api.example.com',
  };
  
  // Validate required environment variables
  const requiredEnvVars = ['REACT_APP_GOOGLE_MAPS_API_KEY'];
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
  
  // Utility function to create headers
  export const createApiHeaders = () => ({
    'Content-Type': 'application/json',
    // Add any other common headers here
  });
  
  export const makeApiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${config.apiUrl}${endpoint}`, {
        ...options,
        headers: {
          ...createApiHeaders(),
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };
  
  export default config;