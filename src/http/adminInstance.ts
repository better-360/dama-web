import axios from 'axios';
import { getUserTokens, saveUserTokens,removeTokens } from '../utils/storage';
import { logOut } from '../store/slices/userSlice';
import { store } from '../store/store';
import { API_BASE_URL } from './constants';
const adminInstance = axios.create({
  baseURL: API_BASE_URL,
});

adminInstance.interceptors.request.use(
  async config => {
    const tokens = getUserTokens();
    if (tokens) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

adminInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const tokens =  getUserTokens();
      if (!tokens) {
        console.error('No tokens found');
        return Promise.reject(
          new Error('Session expired. Please log in again.'),
        );
      }

      try {
        const res = await adminInstance.post('/auth/refresh-token', {
          refreshToken: tokens.refreshToken,
        });

        if (res.status === 200) {
          const {accessToken, refreshToken} = res.data;

          adminInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${refreshToken}`;

          saveUserTokens({accessToken, refreshToken});
          return adminInstance(originalRequest);
        }
      } catch (refreshError) {
        removeTokens();
        store.dispatch(logOut());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default adminInstance;
