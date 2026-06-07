import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { RegisterForm } from '@/features/auth/register';

export function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg animate-rise">
        <CardHeader>
          <CardTitle className="text-2xl">Создание аккаунта</CardTitle>
          <CardDescription>
            Заполните данные, чтобы зарегистрироваться
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <RegisterForm />
          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link
              to={ROUTES.login}
              className="font-medium text-primary hover:underline"
            >
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
