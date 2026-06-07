import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { logoutRequest, useSessionStore } from '@/entities/session';

type LogoutButtonProps = {
  variant?: 'ghost' | 'outline' | 'secondary';
  className?: string;
  onDone?: () => void;
};

export function LogoutButton({
  variant = 'ghost',
  className,
  onDone,
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore((s) => s.clearSession);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutRequest();
    } catch {
      // even if the network call fails, drop the local session
    } finally {
      clearSession();
      queryClient.clear();
      setLoading(false);
      onDone?.();
      navigate(ROUTES.login);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      loading={loading}
      onClick={handleLogout}
      leftIcon={<LogOut className="size-4" />}
      className={className}
    >
      Выйти
    </Button>
  );
}
