import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib';

type Tone = 'info' | 'success' | 'danger';

const tones: Record<Tone, { wrap: string; icon: ReactNode }> = {
  info: {
    wrap: 'bg-primary/10 text-foreground border-primary/20',
    icon: <Info className="size-4 text-primary" />,
  },
  success: {
    wrap: 'bg-success/10 text-foreground border-success/20',
    icon: <CheckCircle2 className="size-4 text-success" />,
  },
  danger: {
    wrap: 'bg-danger/10 text-foreground border-danger/20',
    icon: <AlertCircle className="size-4 text-danger" />,
  },
};

type AlertProps = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function Alert({ tone = 'info', children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm',
        tones[tone].wrap,
        className
      )}
    >
      <span className="mt-0.5">{tones[tone].icon}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
