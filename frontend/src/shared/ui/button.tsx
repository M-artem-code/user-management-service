import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { Spinner } from './spinner';
import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from './button-variants';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  disabled,
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading ? <Spinner className="size-4" /> : leftIcon}
      {children}
    </button>
  );
}
