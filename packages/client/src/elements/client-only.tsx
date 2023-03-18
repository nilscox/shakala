import { useState, useEffect } from 'react';

type ClientOnlyProps = {
  children: React.ReactNode | (() => React.ReactNode);
};

export const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  if (!render) {
    return null;
  }

  if (typeof children === 'function') {
    return <>{children()}</>;
  }

  return <>{children}</>;
};
