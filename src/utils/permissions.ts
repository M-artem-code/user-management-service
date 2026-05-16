import AppError from './appError';

export const assertCanAccessUser = (
  currentUser: { id: string; role: string },
  targetId: string
) => {
  if (currentUser.role !== 'admin' && currentUser.id !== targetId) {
    throw new AppError(403, 'You do not have permission');
  }
};
