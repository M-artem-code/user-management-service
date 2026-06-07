import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Pagination,
  Skeleton,
} from '@/shared/ui';
import { getErrorMessage } from '@/shared/api';
import { getUsers, UserCard } from '@/entities/user';
import { useCurrentUser } from '@/entities/session';
import { BlockUserButton } from '@/features/user/block-user';

const PAGE_SIZE = 8;

export function UsersPanel() {
  const [page, setPage] = useState(1);
  const currentUser = useCurrentUser();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers({ page, limit: PAGE_SIZE }),
  });

  return (
    <Card className="animate-rise">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          Пользователи
          {data && (
            <span className="text-sm font-normal text-muted-foreground">
              · всего {data.pagination.total}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        )}

        {isError && <Alert tone="danger">{getErrorMessage(error)}</Alert>}

        {data && data.users.length === 0 && (
          <EmptyState
            icon={<Users className="size-6" />}
            title="Пользователей нет"
            description="Похоже, в системе пока никого нет."
          />
        )}

        {data && data.users.length > 0 && (
          <div
            className="space-y-3 transition-opacity"
            style={{ opacity: isFetching ? 0.6 : 1 }}
          >
            {data.users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                actions={
                  user.isActive && user.id !== currentUser?.id ? (
                    <BlockUserButton userId={user.id} />
                  ) : null
                }
              />
            ))}
          </div>
        )}

        {data && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
