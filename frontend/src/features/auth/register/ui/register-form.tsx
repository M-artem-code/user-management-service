import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { Button, Field } from '@/shared/ui';
import { getErrorMessage } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { registerSchema, type RegisterValues } from '../model/schema';
import { useRegister } from '../model/use-register';

export function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      lastName: '',
      firstName: '',
      middleName: '',
      birthDate: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (values: RegisterValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Аккаунт создан! Теперь войдите.');
        navigate(ROUTES.login);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Фамилия"
          placeholder="Иванов"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <Field
          label="Имя"
          placeholder="Иван"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Отчество"
          placeholder="Иванович"
          error={errors.middleName?.message}
          {...register('middleName')}
        />
        <Field
          label="Дата рождения"
          type="date"
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />
      </div>

      <Field
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Пароль"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Field
          label="Повтор пароля"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        loading={registerMutation.isPending}
        leftIcon={<UserPlus className="size-4" />}
        className="mt-1 w-full"
      >
        Создать аккаунт
      </Button>
    </form>
  );
}
