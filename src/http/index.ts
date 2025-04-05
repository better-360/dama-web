import { API_BASE_URL } from './constants';
import axiosInstance from './instance';

import axios from 'axios';

const baseApi = axios.create({
  baseURL:API_BASE_URL,
});

export default baseApi;


export {axiosInstance, baseApi};
