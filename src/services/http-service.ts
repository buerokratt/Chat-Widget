import axios from 'axios';
import { RuuterResponse } from '../model/ruuter-response-model';
import { SESSION_STORAGE_CHAT_ID_KEY } from '../constants';
import { getFromLocalStorage } from '../utils/local-storage-utils';
import { WIDGET_INSTANCE_ID } from '../utils/widget-instance-utils';

const http = axios.create({
  baseURL: window._env_.RUUTER_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
  withCredentials: true,
});

http.interceptors.request.use((config: any) => {
  if (WIDGET_INSTANCE_ID) {
    const chatId = getFromLocalStorage(SESSION_STORAGE_CHAT_ID_KEY);
    if (chatId) {
      config.params = { ...config.params, chatId };
    }
  }
  return config;
});

http.interceptors.response.use((response: any) => {
  if (response.status !== 200) return Promise.reject(new Error(`Error: ${response}`));
  const ruuterResponse = response.data as RuuterResponse;
  if (ruuterResponse.response) return ruuterResponse.response;
  return response;
});

export default http;
