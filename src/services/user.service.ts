import { Prisma } from '../../generated/prisma/client';
import { blockUserSelect, publicUserSelect } from '../constants/user.select';
import {
  findAllUsers,
  findUniqueUser,
  updateUser,
} from '../repositories/user.repository';
import AppError from '../utils/appError';
import { assertCanAccessUser } from '../utils/permissions';

type CurrentUser = { id: string; role: string };

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const getUserById = async (
  currentUser: CurrentUser,
  targetId: string
) => {
  assertCanAccessUser(currentUser, targetId);

  const user = await findUniqueUser({ id: targetId }, publicUserSelect);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const getAllUsers = async (params: {
  page?: string;
  limit?: string;
}) => {
  const page = Math.max(DEFAULT_PAGE, Number(params.page) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(params.limit) || DEFAULT_LIMIT)
  );

  const { users, total } = await findAllUsers({
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const blockUser = async (currentUser: CurrentUser, targetId: string) => {
  assertCanAccessUser(currentUser, targetId);

  try {
    return await updateUser(
      { id: targetId },
      { isActive: false },
      blockUserSelect
    );
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      throw new AppError(404, 'User not found');
    }
    throw err;
  }
};
