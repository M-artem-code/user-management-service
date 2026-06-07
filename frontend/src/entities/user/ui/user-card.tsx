import type { ReactNode } from 'react';
import { Avatar } from '@/shared/ui';
import type { User } from '@/shared/types';
import { cn } from '@/shared/lib';
import { getFullName } from '../model/user';
import { RoleBadge } from './role-badge';
import { StatusBadge } from './status-badge';

type UserCardProps = {
  user: User;
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function UserCard({ user, actions, onClick, className }: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'card-surface flex flex-col gap-4 p-4 transition-shadow sm:flex-row sm:items-center sm:justify-between',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={getFullName(user)} />
        <div className="min-w-0">
          <p className="truncate font-medium">{getFullName(user)}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <RoleBadge role={user.role} />
        <StatusBadge active={user.isActive} />
        {actions}
      </div>
    </div>
  );
}
