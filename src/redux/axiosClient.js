import axios from 'axios';
import queryString from 'query-string';

import { baseUrl } from '../constants';

const axiosClient = axios.create({
  headers: { 'content-type': 'application/json' },
  // headers: { 'content-type': 'multipart/form-data' },
  paramsSerializer: params => queryString.stringify(params),
  baseURL: baseUrl
});

axiosClient.interceptors.request.use(async config => {
  const token = localStorage.getItem('token');
  const currentConfig = config;

  if (token) {
    currentConfig.headers.Authorization = `Bearer ${token}`;
  }

  return currentConfig;
});

axiosClient.interceptors.response.use(response => {
  if (response && response.data) {
    return response.data;
  }

  return response;
});

export default axiosClient;
