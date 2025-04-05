import axios from 'axios';
import { getUserTokens, saveUserTokens,removeTokens } from '../utils/storage';
import { store } from '../store/store';
import { API_BASE_URL } from './constants';
import { logOutApplicator } from '../store/slices/applicatorSlice';
const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
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

instance.interceptors.response.use(
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
        const res = await instance.post('applicator/auth/refresh-token', {
          refreshToken: tokens.refreshToken,
        });

        if (res.status === 200) {
          const {accessToken, refreshToken} = res.data;

          instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${refreshToken}`;

          saveUserTokens({accessToken, refreshToken});
          return instance(originalRequest);
        }
      } catch (refreshError) {
        removeTokens();
        store.dispatch(logOutApplicator());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
