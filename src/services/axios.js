import axios from 'axios'
import { NotificationService } from './notification';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL// BackEnd URL
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)
// get from {https://blog.theashishmaurya.me/handling-jwt-access-and-refresh-token-using-axios-in-react-app} and adapted to our use case, can be changed later :)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await api.patch(`/refresh?refreshToken=${refreshToken}`);
        const { newToken, newRefreshToken } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // if (refreshError.response.status === 401) {
        // Handle refresh token error or redirect to login

        if (refreshError.response.status === 400) {
          await NotificationService.error({ text: 'Seu acesso expirou, faça login novamente' })
          localStorage.clear();
          window.location.href = '/';
          return Promise.reject(refreshError)
        }
        // }
      }
    }
    return Promise.reject(error);
  }
);