import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '../lib';
import { Input } from './input';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Field({
  label,
  error,
  className,
  id,
  ref,
  ...props
}: FieldProps) {
  const inputId = id ?? props.name;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Input id={inputId} ref={ref} invalid={!!error} {...props} />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
