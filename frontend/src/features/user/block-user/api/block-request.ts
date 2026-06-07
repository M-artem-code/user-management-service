import { apiClient, type ApiDataResponse } from '@/shared/api';

type BlockedUser = { id: string; email: string; isActive: boolean };

export async function blockUserRequest(id: string): Promise<BlockedUser> {
  const { data } = await apiClient.patch<
    ApiDataResponse<{ user: BlockedUser }>
  >(`/users/${id}/block`);
  return data.data.user;
}
