import { useEffect, useState } from 'react';

import { Fallback } from '~/components/elements/fallback';

import Loader from './loader.svg';

type AsyncResourceProps<T> = {
  data: T | undefined;
  loading: boolean;
  error?: unknown;
  renderError?: (error: unknown) => JSX.Element;
  render: (data: T) => JSX.Element;
};

export const AsyncResource = <T,>({ data, loading, error, renderError, render }: AsyncResourceProps<T>) => {
  const [displayLoader, setDisplayLoader] = useState(false);
  const [prevData, setPrevData] = useState(data);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => setDisplayLoader(true), 220);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  useEffect(() => {
    if (data) {
      setPrevData(data);
    }
  }, [data]);

  if (error) {
    if (!renderError) {
      throw error;
    }

    return renderError(error);
  }

  if (loading && !data) {
    const d = data ?? prevData;

    if (d) {
      return (
        <div className="relative">
          {render(d)}
          {displayLoader && <div className="absolute inset-0 animate-loading-surface bg-neutral/50" />}
        </div>
      );
    }

    return <Fallback>{displayLoader && <Loader />}</Fallback>;
  }

  if (data) {
    return render(data);
  }

  return null;
};
