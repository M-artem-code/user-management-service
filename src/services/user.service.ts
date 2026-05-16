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

export const getUserById = async (currentUser: CurrentUser, targetId: string) => {
  assertCanAccessUser(currentUser, targetId);

  const user = await findUniqueUser({ id: targetId }, publicUserSelect);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const getAllUsers = () => findAllUsers();

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
