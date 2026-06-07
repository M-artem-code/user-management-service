import { ROLES } from '../constants/roles';
import { CurrentUser } from '../types/user';
import AppError from './appError';

export const assertCanAccessUser = (
  currentUser: CurrentUser,
  targetId: string
) => {
  if (currentUser.role !== ROLES.admin && currentUser.id !== targetId) {
    throw new AppError(403, 'You do not have permission');
  }
};
