import { ReactNode } from 'react';

type FallbackProps = {
  children: ReactNode;
};

export const Fallback = ({ children }: FallbackProps) => (
  <div className="flex justify-center items-center font-bold text-text-light min-h">{children}</div>
);
