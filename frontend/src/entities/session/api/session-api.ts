import { apiClient } from '@/shared/api';

type RefreshResponse = { status: 'success'; access_token: string };

/** Exchange the refresh_token cookie for a fresh access token. */
export async function refreshToken(): Promise<string> {
  const { data } = await apiClient.get<RefreshResponse>('/auth/refresh');
  return data.access_token;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.get('/auth/logout');
}
