import { CalendarDays, Hash, Mail } from 'lucide-react';
import type { ReactNode } from 'react';
import { Avatar, Card, CardContent, CardHeader, Container } from '@/shared/ui';
import { useCurrentUser } from '@/entities/session';
import {
  formatDate,
  getFullName,
  RoleBadge,
  StatusBadge,
} from '@/entities/user';

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
      <span className="text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const user = useCurrentUser();
  if (!user) return null;

  return (
    <Container className="py-8 sm:py-10">
      <Card className="mx-auto max-w-2xl animate-rise">
        <CardHeader className="flex-row items-center gap-4">
          <Avatar name={getFullName(user)} className="size-16 text-lg" />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">{getFullName(user)}</h1>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <RoleBadge role={user.role} />
              <StatusBadge active={user.isActive} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<Mail className="size-4" />}
            label="Email"
            value={user.email}
          />
          <InfoRow
            icon={<CalendarDays className="size-4" />}
            label="Дата рождения"
            value={formatDate(user.birthDate)}
          />
          <InfoRow
            icon={<CalendarDays className="size-4" />}
            label="Зарегистрирован"
            value={formatDate(user.createdAt)}
          />
          <InfoRow
            icon={<Hash className="size-4" />}
            label="ID"
            value={user.id}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
