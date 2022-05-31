import { ReactNode } from 'react';

type FallbackProps = {
  children: ReactNode;
};

export const Fallback = ({ children }: FallbackProps) => (
  <div className="flex flex-col justify-center items-center min-h-big font-bold text-text-light">
    {children}
  </div>
);
