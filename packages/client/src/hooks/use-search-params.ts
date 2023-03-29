import { useCallback, useMemo } from 'react';
import { navigate } from 'vite-plugin-ssr/client/router';

import { usePageContext } from '../app/app-providers';

import { usePathname } from './use-pathname';

// todo: watch search params
export const useSearchParams = () => {
  const { searchOriginal } = usePageContext();

  return useMemo(() => {
    return new URLSearchParams(searchOriginal);
  }, [searchOriginal]);
};

export const useGetSearchParam = (key: string) => {
  return useSearchParams().get(key);
};

export const useSetSearchParam = (key: string) => {
  const params = useSearchParams();
  const pathname = usePathname();

  return useCallback(
    (value: string) => {
      if (params.get(key) === value) {
        return;
      }

      params.set(key, value);

      void navigate(`${pathname}?${params}`);
    },
    [key, pathname, params]
  );
};

export const useSearchParam = (key: string) => {
  return [useGetSearchParam(key), useSetSearchParam(key)] as const;
};
