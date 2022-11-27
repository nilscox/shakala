import { useEffect, useState } from 'react';

type AsyncResourceProps = {
  loading: boolean;
  loader: (show: boolean) => React.ReactNode;
  children: () => React.ReactNode;
};

export const AsyncResource = ({ loading, loader, children }: AsyncResourceProps) => {
  const [displayLoader, setDisplayLoader] = useState(false);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => setDisplayLoader(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading) {
    return <>{loader(displayLoader)}</>;
  }

  return <>{children()}</>;
};
