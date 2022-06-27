import { ReactNode } from 'react';

type FallbackProps = {
  children: ReactNode;
};

export const Fallback = ({ children }: FallbackProps) => (
  <div className="flex flex-col justify-center items-center min-h-fallback font-bold text-muted">
    {children}
  </div>
);
