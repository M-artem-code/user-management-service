import { randomUUID } from 'node:crypto';
import { Prisma } from '../generated/prisma/client';

export type StoredUser = {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
  birthDate: Date;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const store = new Map<string, StoredUser>();

export const reset = () => store.clear();

export const seed = (overrides: Partial<StoredUser> = {}): StoredUser => {
  const now = new Date();
  const user: StoredUser = {
    id: overrides.id ?? randomUUID(),
    lastName: overrides.lastName ?? 'Doe',
    firstName: overrides.firstName ?? 'John',
    middleName: overrides.middleName ?? null,
    birthDate: overrides.birthDate ?? new Date('1990-01-01'),
    email: (overrides.email ?? `user-${randomUUID()}@example.com`).toLowerCase(),
    password: overrides.password ?? 'hashed-password',
    role: overrides.role ?? 'user',
    isActive: overrides.isActive ?? true,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  };
  store.set(user.id, user);
  return user;
};

export const allUsers = () => [...store.values()];

const project = (user: StoredUser, select?: Record<string, boolean>) => {
  if (!select) return { ...user };
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(select)) {
    if (select[key]) result[key] = (user as Record<string, unknown>)[key];
  }
  return result;
};

const findBy = (where: { id?: string; email?: string }) => {
  if (where.id) return store.get(where.id) ?? null;
  if (where.email) {
    const email = where.email.toLowerCase();
    return allUsers().find((u) => u.email === email) ?? null;
  }
  return null;
};

// --- repository surface (mirrors src/repositories/user.repository.ts) ---

export const createUser = async (
  input: any,
  select?: Record<string, boolean>
) => {
  const email = String(input.email).toLowerCase();
  if (allUsers().some((u) => u.email === email)) {
    throw new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed on the fields: (`email`)',
      { code: 'P2002', clientVersion: '7.8.0' }
    );
  }
  const user = seed({ ...input, email });
  return project(user, select);
};

export const findUniqueUser = async (
  where: { id?: string; email?: string },
  select?: Record<string, boolean>
) => {
  const user = findBy(where);
  return user ? project(user, select) : null;
};

export const findAllUsers = async ({
  skip,
  take,
}: {
  skip: number;
  take: number;
}) => {
  const sorted = allUsers().sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  const page = sorted.slice(skip, skip + take);
  return {
    users: page.map((u) =>
      project(u, {
        id: true,
        lastName: true,
        firstName: true,
        middleName: true,
        birthDate: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      })
    ),
    total: sorted.length,
  };
};

export const updateUser = async (
  where: { id?: string; email?: string },
  data: Record<string, unknown>,
  select?: Record<string, boolean>
) => {
  const user = findBy(where);
  if (!user) {
    throw new Prisma.PrismaClientKnownRequestError(
      'An operation failed because it depends on one or more records that were required but not found.',
      { code: 'P2025', clientVersion: '7.8.0' }
    );
  }
  Object.assign(user, data, { updatedAt: new Date() });
  store.set(user.id, user);
  return project(user, select);
};
