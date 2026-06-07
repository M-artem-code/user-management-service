import { AxiosError } from 'axios';
import type { ApiErrorBody } from './types';

/** Turn any thrown value (axios error, Error, unknown) into a readable string. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Что-то пошло не так'
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.errors?.length) {
      return data.errors.map((e) => e.message).join('. ');
    }
    if (data?.message) return data.message;
    if (error.code === 'ERR_NETWORK') {
      return 'Не удалось подключиться к серверу. Запущен ли бэкенд?';
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
