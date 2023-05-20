import { clsx } from 'clsx';
import { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  start?: React.ReactNode;
  end?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ start, end, className, ...props }, ref): JSX.Element => (
    <div
      className={clsx(
        'row items-center overflow-hidden rounded border bg-neutral focus-within:border-primary',
        className
      )}
    >
      {start}
      <input ref={ref} className="w-full px-1 py-0.5 outline-none" {...props} />
      {end}
    </div>
  )
);

Input.displayName = 'Input';
