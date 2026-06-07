import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config';
import type { ApiErrorBody } from './types';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/* ----------------------- Auth wiring (set by session) ---------------------- */
// Shared stays independent of the session entity: the session layer registers
// how to read the current token and how to refresh it.
let accessTokenGetter: () => string | null = () => null;
let refreshHandler: (() => Promise<string | null>) | null = null;

export const setAccessTokenGetter = (getter: () => string | null) => {
  accessTokenGetter = getter;
};

export const setRefreshHandler = (
  handler: (() => Promise<string | null>) | null
) => {
  refreshHandler = handler;
};

/* ------------------------------- Interceptors ------------------------------ */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = accessTokenGetter();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh');

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint &&
      refreshHandler
    ) {
      original._retry = true;
      const newToken = await refreshHandler();
      if (newToken) {
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  }
);
