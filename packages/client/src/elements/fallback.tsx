import clsx from 'clsx';
import { ReactNode } from 'react';

type FallbackProps = {
  className?: string;
  children: ReactNode;
};

export const Fallback = ({ className, children }: FallbackProps) => (
  <div
    className={clsx(
      'flex min-h-1 flex-col items-center justify-center font-bold text-muted md:min-h-2',
      className
    )}
  >
    {children}
  </div>
);
