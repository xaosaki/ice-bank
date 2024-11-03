import axios from 'axios';

const httpClient = axios.create({
  baseURL: (window as any).config.VUE_APP_API_BASE_URL
});
const httpClientWithToken = axios.create({
  baseURL: (window as any).config.VUE_APP_API_BASE_URL
});

httpClientWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

httpClientWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export { httpClientWithToken, httpClient };
