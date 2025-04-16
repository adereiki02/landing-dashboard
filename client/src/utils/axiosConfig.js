import axios from 'axios';

// Set base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://reikidevs-official-production.up.railway.app/';

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    // Get the token from localStorage before every request
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo.token) {
          config.headers['Authorization'] = `Bearer ${userInfo.token}`;
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // If we get a 401 Unauthorized response, the token might be expired
      // You can redirect to login or refresh the token here
      console.log('Unauthorized access - redirecting to login');
      // Clear user info from localStorage
      localStorage.removeItem('userInfo');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;