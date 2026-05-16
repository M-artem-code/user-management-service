import type { Prisma } from '../../generated/prisma/client';

export const publicUserSelect = {
  id: true,
  lastName: true,
  firstName: true,
  middleName: true,
  birthDate: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const blockUserSelect = {
  id: true,
  email: true,
  isActive: true,
} satisfies Prisma.UserSelect;
