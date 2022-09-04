import { ReactNode } from 'react';

type FallbackProps = {
  children: ReactNode;
};

export const Fallback = ({ children }: FallbackProps) => (
  <div className="flex min-h-2 flex-col items-center justify-center font-bold text-muted">{children}</div>
);
