import type { User } from '@/shared/types';

export function getFullName(
  user: Pick<User, 'lastName' | 'firstName' | 'middleName'>
): string {
  return [user.lastName, user.firstName, user.middleName]
    .filter(Boolean)
    .join(' ');
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
