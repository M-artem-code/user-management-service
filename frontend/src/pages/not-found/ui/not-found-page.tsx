import { Link } from 'react-router-dom';
import { Container, buttonVariants } from '@/shared/ui';
import { ROUTES } from '@/shared/config';

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-7xl font-bold text-gradient">404</p>
      <h1 className="text-2xl font-semibold">Страница не найдена</h1>
      <p className="max-w-sm text-muted-foreground">
        Возможно, ссылка устарела или страница была перемещена.
      </p>
      <Link to={ROUTES.home} className={buttonVariants({ size: 'lg' })}>
        На главную
      </Link>
    </Container>
  );
}
