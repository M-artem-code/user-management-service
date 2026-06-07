import { ShieldCheck, User as UserIcon } from 'lucide-react';
import { Badge } from '@/shared/ui';
import type { Role } from '@/shared/types';

export function RoleBadge({ role }: { role: Role }) {
  if (role === 'admin') {
    return (
      <Badge tone="primary">
        <ShieldCheck className="size-3.5" />
        Администратор
      </Badge>
    );
  }
  return (
    <Badge tone="neutral">
      <UserIcon className="size-3.5" />
      Пользователь
    </Badge>
  );
}
