import { clsx } from 'clsx';
import { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref): JSX.Element => (
    <input ref={ref} className={clsx('min-w-1 rounded border py-0.5 px-1', className)} {...props} />
  ),
);

Input.displayName = 'Input';
