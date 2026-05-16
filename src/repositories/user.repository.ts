import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../utils/prisma';

export const createUser = async (
  input: Prisma.UserCreateInput,
  select?: Prisma.UserSelect
) => {
  return prisma.user.create({ data: input, select });
};

export const findUser = async (
  where: Partial<Prisma.UserCreateInput>,
  select?: Prisma.UserSelect
) => {
  return prisma.user.findFirst({ where, select });
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return prisma.user.findUnique({ where, select });
};

export const findAllUsers = async () => {
  return prisma.user.findMany({
    omit: { password: true },
  });
};

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect
) => {
  return prisma.user.update({ where, data, select });
};
