import { useCallback } from 'react';
import { navigate } from 'vite-plugin-ssr/client/router';

import { useRouter } from '~/app/router-context';

import { usePathname } from './use-pathname';

export const useSearchParams = () => {
  return useRouter().search;
};

export const useGetSearchParam = (key: string) => {
  return useSearchParams().get(key);
};

export const useSetSearchParam = (key: string) => {
  const params = useSearchParams();
  const pathname = usePathname();

  return useCallback(
    (value: string | undefined) => {
      if (params.get(key) === value) {
        return;
      }

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      let paramsStr = '';

      if (Array.from(params.keys()).length > 0) {
        paramsStr += '?' + params;
      }

      void navigate(`${pathname}${paramsStr}`);
    },
    [key, pathname, params]
  );
};

export const useSearchParam = (key: string) => {
  return [useGetSearchParam(key), useSetSearchParam(key)] as const;
};
