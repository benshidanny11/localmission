import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,

  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, redirecting to login...');
     // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
