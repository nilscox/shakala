import { useEffect, useState } from 'react';

import { Fallback } from '~/components/elements/fallback';

type AsyncResourceProps<T> = {
  data: T | undefined;
  loading: boolean;
  error?: unknown;
  renderError?: (error: unknown) => JSX.Element;
  renderLoading?: (data: T | undefined) => JSX.Element;
  render: (data: T) => JSX.Element;
};

export const AsyncResource = <T,>({
  data,
  loading,
  error,
  renderLoading,
  renderError,
  render,
}: AsyncResourceProps<T>) => {
  const [displayLoader, setDisplayLoader] = useState(false);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => setDisplayLoader(true), 220);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (error) {
    if (!renderError) {
      throw error;
    }

    return renderError(error);
  }

  if (loading) {
    if (renderLoading) {
      return renderLoading(data);
    }

    return <Fallback>{displayLoader && 'Loading...'}</Fallback>;
  }

  if (data) {
    return render(data);
  }

  return null;
};
