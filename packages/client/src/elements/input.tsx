import { clsx } from 'clsx';
import { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  start?: React.ReactNode;
  end?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ start, end, className, ...props }, ref): JSX.Element => (
    <div className={clsx('row gap-1 rounded border bg-neutral py-0.5 px-1', className)}>
      {start}
      <input ref={ref} className="w-full outline-none" {...props} />
      {end}
    </div>
  )
);

Input.displayName = 'Input';
