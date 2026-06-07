import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button, Field } from '@/shared/ui';
import { getErrorMessage } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { loginSchema, type LoginValues } from '../model/schema';
import { useLogin } from '../model/use-login';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginValues) => {
    login.mutate(values, {
      onSuccess: (user) => {
        toast.success(`С возвращением, ${user.firstName}!`);
        navigate(ROUTES.profile);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="relative">
        <Field
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={login.isPending}
        leftIcon={<LogIn className="size-4" />}
        className="mt-1 w-full"
      >
        Войти
      </Button>
    </form>
  );
}
