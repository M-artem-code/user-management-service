import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib';
import { cn } from '../lib';

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Переключить тему"
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-lg border border-border',
        'bg-card text-foreground transition-colors hover:bg-muted',
        'focus-visible:ring-2 focus-visible:ring-ring outline-none',
        className
      )}
    >
      {theme === 'dark' ? (
        <Sun className="size-4.5" />
      ) : (
        <Moon className="size-4.5" />
      )}
    </button>
  );
}
