import { Ban, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/shared/ui';

export function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge tone="success">
      <CheckCircle2 className="size-3.5" />
      Активен
    </Badge>
  ) : (
    <Badge tone="danger">
      <Ban className="size-3.5" />
      Заблокирован
    </Badge>
  );
}
