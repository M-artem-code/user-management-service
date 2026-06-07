import type { Prisma } from '../../generated/prisma/client';
import { publicUserSelect } from '../constants/user.select';
import { prisma } from '../utils/prisma';

export const createUser = async (
  input: Prisma.UserCreateInput,
  select?: Prisma.UserSelect
) => {
  return prisma.user.create({ data: input, select });
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return prisma.user.findUnique({ where, select });
};

export const findAllUsers = async ({
  skip,
  take,
}: {
  skip: number;
  take: number;
}) => {
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      select: publicUserSelect,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return { users, total };
};

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect
) => {
  return prisma.user.update({ where, data, select });
};
