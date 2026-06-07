import { cn } from '../lib';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:opacity-100',
  secondary: 'bg-muted text-foreground hover:bg-muted/70 border border-border',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
  outline: 'bg-transparent text-foreground border border-border hover:bg-muted',
  danger:
    'bg-danger text-danger-foreground shadow-sm hover:opacity-90 active:opacity-100',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2',
  icon: 'h-10 w-10 p-0',
};

const base = cn(
  'inline-flex items-center justify-center rounded-lg font-medium',
  'transition-all duration-150 outline-none cursor-pointer',
  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed disabled:opacity-60'
);

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}
