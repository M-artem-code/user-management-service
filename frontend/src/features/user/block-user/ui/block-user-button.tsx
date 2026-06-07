import { toast } from 'sonner';
import { Ban } from 'lucide-react';
import { Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/api';
import { useBlockUser } from '../model/use-block-user';

type BlockUserButtonProps = {
  userId: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  onBlocked?: () => void;
};

export function BlockUserButton({
  userId,
  disabled,
  size = 'sm',
  onBlocked,
}: BlockUserButtonProps) {
  const blockUser = useBlockUser();

  const handleClick = () => {
    if (!window.confirm('Заблокировать этого пользователя?')) return;

    blockUser.mutate(userId, {
      onSuccess: () => {
        toast.success('Пользователь заблокирован');
        onBlocked?.();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Button
      variant="danger"
      size={size}
      disabled={disabled}
      loading={blockUser.isPending}
      onClick={handleClick}
      leftIcon={<Ban className="size-4" />}
    >
      Заблокировать
    </Button>
  );
}
