import { cn } from '../lib';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  return (first + second).toUpperCase() || '?';
}

type AvatarProps = {
  name: string;
  className?: string;
};

export function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full',
        'bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white',
        'select-none shadow-sm',
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
