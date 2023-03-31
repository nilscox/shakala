import { useCallback } from 'react';

import { useRouter } from '~/app/router-context';

import { useNavigate } from './use-navigate';
import { usePathname } from './use-pathname';

export const useSearchParams = () => {
  return useRouter().search;
};

export const useGetSearchParam = (key: string) => {
  return useSearchParams().get(key) ?? undefined;
};

export const useSetSearchParam = (key: string) => {
  const navigate = useNavigate();

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

      navigate(`${pathname}${paramsStr}`);
    },
    [key, pathname, params, navigate]
  );
};

export const useSearchParam = (key: string) => {
  return [useGetSearchParam(key), useSetSearchParam(key)] as const;
};
