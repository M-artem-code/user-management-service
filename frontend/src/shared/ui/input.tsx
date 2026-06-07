import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '../lib';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
};

export function Input({ className, invalid, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground',
        'placeholder:text-muted-foreground/70 transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
        invalid ? 'border-danger focus-visible:ring-danger' : 'border-input',
        className
      )}
      {...props}
    />
  );
}
