import clsx from 'clsx';
import { ReactNode } from 'react';

type FallbackProps = {
  className?: string;
  children: ReactNode;
};

export const Fallback = ({ className, children }: FallbackProps) => (
  <div
    className={clsx(
      'col min-h-1 items-center justify-center gap-4 font-bold text-muted md:min-h-2',
      className
    )}
  >
    {children}
  </div>
);
