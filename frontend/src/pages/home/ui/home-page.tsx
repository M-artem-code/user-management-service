import { Link } from 'react-router-dom';
import {
  ArrowRight,
  KeyRound,
  LayoutDashboard,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { buttonVariants, Card, Container } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useIsAuthenticated } from '@/entities/session';

const features = [
  {
    icon: ShieldCheck,
    title: 'Безопасная авторизация',
    text: 'JWT access/refresh токены, httpOnly-cookies и защита от эскалации ролей.',
  },
  {
    icon: LayoutDashboard,
    title: 'Управление пользователями',
    text: 'Просмотр, пагинация и блокировка пользователей для администраторов.',
  },
  {
    icon: Zap,
    title: 'Быстрый и адаптивный UI',
    text: 'React + Vite, тёмная тема и аккуратная вёрстка под любые экраны.',
  },
];

export function HomePage() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Container className="py-16 sm:py-24">
      <section className="mx-auto max-w-3xl text-center animate-rise">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <KeyRound className="size-3.5 text-primary" />
          User Management Service
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Управляйте пользователями <br className="hidden sm:block" />
          <span className="text-gradient">красиво и безопасно</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Современная панель на Feature-Sliced Design: регистрация, вход,
          профиль и админ-инструменты — всё в одном адаптивном интерфейсе.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link
              to={ROUTES.profile}
              className={buttonVariants({ size: 'lg' })}
            >
              Перейти в профиль
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.register}
                className={buttonVariants({ size: 'lg' })}
              >
                Начать
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to={ROUTES.login}
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                У меня есть аккаунт
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="mt-20 grid gap-5 sm:grid-cols-3">
        {features.map((feature, i) => (
          <Card
            key={feature.title}
            className="p-6 animate-rise"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {feature.text}
            </p>
          </Card>
        ))}
      </section>
    </Container>
  );
}
