import { Container } from '@/shared/ui';
import { UsersPanel } from '@/widgets/users-panel';

export function UsersPage() {
  return (
    <Container className="py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Администрирование</h1>
        <p className="text-sm text-muted-foreground">
          Список пользователей системы и управление доступом
        </p>
      </div>
      <UsersPanel />
    </Container>
  );
}
