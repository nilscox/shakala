import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchParam = (name: string) => {
  const [params] = useSearchParams();

  return params.get(name) ?? undefined;
};

export const useSetSearchParam = () => {
  const [params, setParams] = useSearchParams();

  return useCallback(
    (key: string, value: string | undefined) => {
      const nextParams = new URLSearchParams(params);

      if (value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }

      setParams(nextParams);
    },
    [params, setParams],
  );
};
