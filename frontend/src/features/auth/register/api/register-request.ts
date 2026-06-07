import { apiClient, type ApiDataResponse } from '@/shared/api';
import type { User } from '@/shared/types';
import type { RegisterValues } from '../model/schema';

export async function registerRequest(values: RegisterValues): Promise<User> {
  // Drop empty optional middleName so we don't send "" to the API.
  const payload: RegisterValues = { ...values };
  if (!payload.middleName) delete payload.middleName;

  const { data } = await apiClient.post<ApiDataResponse<{ user: User }>>(
    '/auth/register',
    payload
  );
  return data.data.user;
}
