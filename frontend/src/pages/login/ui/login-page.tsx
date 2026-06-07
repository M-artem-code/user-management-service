import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { LoginForm } from '@/features/auth/login';

export function LoginPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md animate-rise">
        <CardHeader>
          <CardTitle className="text-2xl">С возвращением</CardTitle>
          <CardDescription>
            Войдите в свой аккаунт, чтобы продолжить
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <Link
              to={ROUTES.register}
              className="font-medium text-primary hover:underline"
            >
              Зарегистрироваться
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
