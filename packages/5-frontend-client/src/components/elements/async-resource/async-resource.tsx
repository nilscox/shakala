import { useEffect, useState } from 'react';

import { Fallback } from '~/components/elements/fallback';

type AsyncResourceProps<T> = {
  data: T | undefined;
  loading: boolean;
  error?: unknown;
  renderError?: (error: unknown) => JSX.Element;
  render: (data: T) => JSX.Element;
};

export const AsyncResource = <T,>({ data, loading, error, renderError, render }: AsyncResourceProps<T>) => {
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
    if (data) {
      return (
        <div className="relative">
          {render(data)}
          {displayLoader && <div className="absolute inset-0 bg-neutral/50 animate-loading-surface" />}
        </div>
      );
    }

    return <Fallback>{displayLoader && 'Loading...'}</Fallback>;
  }

  if (data) {
    return render(data);
  }

  return null;
};
