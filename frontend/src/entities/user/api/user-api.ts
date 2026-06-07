import { apiClient, type ApiDataResponse, type Paginated } from '@/shared/api';
import type { User } from '@/shared/types';

export type UsersListParams = {
  page?: number;
  limit?: number;
};

export type UsersListResult = {
  users: User[];
  pagination: Paginated<unknown>['pagination'];
};

export async function getUsers(
  params: UsersListParams = {}
): Promise<UsersListResult> {
  const { data } = await apiClient.get<Paginated<{ users: User[] }>>('/users', {
    params,
  });
  return { users: data.data.users, pagination: data.pagination };
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await apiClient.get<ApiDataResponse<{ user: User }>>(
    `/users/${id}`
  );
  return data.data.user;
}
