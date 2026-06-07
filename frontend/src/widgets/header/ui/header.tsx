import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShieldCheck, Users, X } from 'lucide-react';
import { Avatar, buttonVariants, Container, ThemeToggle } from '@/shared/ui';
import { cn } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import {
  useCurrentUser,
  useIsAdmin,
  useIsAuthenticated,
} from '@/entities/session';
import { getFullName } from '@/entities/user';
import { LogoutButton } from '@/features/auth/logout';

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  );
}

export function Header() {
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to={ROUTES.home}
          className="flex items-center gap-2"
          onClick={close}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
            <ShieldCheck className="size-5" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            User<span className="text-gradient">Management</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {isAuthenticated && (
            <>
              <NavLink to={ROUTES.profile} className={navLinkClass}>
                Профиль
              </NavLink>
              {isAdmin && (
                <NavLink to={ROUTES.users} className={navLinkClass}>
                  Пользователи
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-1">
              <Avatar name={getFullName(user)} className="size-9" />
              <LogoutButton />
            </div>
          ) : (
            <>
              <Link
                to={ROUTES.login}
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Войти
              </Link>
              <Link
                to={ROUTES.register}
                className={buttonVariants({ size: 'sm' })}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                  <Avatar name={getFullName(user)} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {getFullName(user)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <NavLink
                  to={ROUTES.profile}
                  className={navLinkClass}
                  onClick={close}
                >
                  Профиль
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to={ROUTES.users}
                    className={navLinkClass}
                    onClick={close}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Users className="size-4" /> Пользователи
                    </span>
                  </NavLink>
                )}
                <div className="px-1 pt-1">
                  <LogoutButton
                    variant="outline"
                    className="w-full"
                    onDone={close}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-1">
                <Link
                  to={ROUTES.login}
                  onClick={close}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Войти
                </Link>
                <Link
                  to={ROUTES.register}
                  onClick={close}
                  className={buttonVariants()}
                >
                  Регистрация
                </Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
