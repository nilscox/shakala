import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { usePathname } from './use-pathname';
import { useSearchParams } from './use-search-params';

export const useSearchParam = (name: string) => {
  const params = useSearchParams();

  return params.get(name) ?? undefined;
};

export const useSetSearchParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return useCallback(
    (key: string, value: string | undefined) => {
      const nextParams = new URLSearchParams(params);

      if (value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }

      router.push(`${pathname}?${nextParams}`);
    },
    [pathname, params, router],
  );
};
