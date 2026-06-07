import { apiClient } from '@/shared/api';
import type { LoginValues } from '../model/schema';

type LoginResponse = { status: 'success'; access_token: string };

export async function loginRequest(values: LoginValues): Promise<string> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', values);
  return data.access_token;
}
