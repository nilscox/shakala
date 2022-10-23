import clsx from 'clsx';
import { useEffect, useState } from 'react';

import Loader from './loader.svg';

type InfiniteScrollProps<T> = {
  items: T[];
  hasMore: boolean;
  loading?: boolean;
  offset?: number;
  loaderClassName?: string;
  loadMore: () => void;
  children: (item: T, index: number) => React.ReactNode;
};

export const InfiniteScroll = <T,>({
  items,
  hasMore,
  loading,
  offset = 200,
  loaderClassName,
  loadMore,
  children,
}: InfiniteScrollProps<T>) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) {
      return;
    }

    const onScroll = () => {
      const { top } = ref.getBoundingClientRect();

      if (top - window.innerHeight < offset && hasMore && !loading) {
        loadMore();
      }
    };

    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, [ref, offset, hasMore, loading, loadMore]);

  return (
    <>
      {items.map(children)}
      <div ref={setRef}>{loading && <Loader className={clsx('text-muted', loaderClassName)} />}</div>
    </>
  );
};
