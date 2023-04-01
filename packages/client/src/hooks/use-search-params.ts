import { useCallback } from 'react';

import { useNavigate, usePathname, useSearchParams } from './use-router';

export const useGetSearchParam = (key: string) => {
  return useSearchParams().get(key) ?? undefined;
};

export const useSetSearchParams = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const params = useSearchParams();

  return useCallback(
    (newParams: Record<string, string | number | undefined>) => {
      for (const [key, value] of Object.entries(newParams)) {
        if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      }

      let paramsStr = '';

      if (Array.from(params.keys()).length > 0) {
        paramsStr += '?' + params;
      }

      navigate(pathname + paramsStr, { keepScrollPosition: true });
    },
    [pathname, params, navigate]
  );
};

export const useSetSearchParam = (key: string) => {
  const params = useSearchParams();
  const setSearchParams = useSetSearchParams();

  return useCallback(
    (value: string | number | undefined) => {
      if (params.get(key) === value) {
        return;
      }

      setSearchParams({ [key]: value });
    },
    [key, params, setSearchParams]
  );
};

export const useSearchParam = (key: string) => {
  return [useGetSearchParam(key), useSetSearchParam(key)] as const;
};
