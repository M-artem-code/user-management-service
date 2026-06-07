export const ROLES = {
  user: 'user',
  admin: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type User = {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
  birthDate: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
};
