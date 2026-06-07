import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useSessionStatus, useIsAdmin } from '@/entities/session';

function FullScreenLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}

/** Requires an authenticated session. */
export function ProtectedRoute() {
  const status = useSessionStatus();

  if (status === 'loading') return <FullScreenLoader />;
  if (status === 'anonymous') return <Navigate to={ROUTES.login} replace />;
  return <Outlet />;
}

/** Requires an authenticated admin session. */
export function AdminRoute() {
  const status = useSessionStatus();
  const isAdmin = useIsAdmin();

  if (status === 'loading') return <FullScreenLoader />;
  if (status === 'anonymous') return <Navigate to={ROUTES.login} replace />;
  if (!isAdmin) return <Navigate to={ROUTES.profile} replace />;
  return <Outlet />;
}

/** Only for unauthenticated visitors (login / register). */
export function GuestRoute() {
  const status = useSessionStatus();

  if (status === 'loading') return <FullScreenLoader />;
  if (status === 'authenticated')
    return <Navigate to={ROUTES.profile} replace />;
  return <Outlet />;
}
