import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchParam = (key: string) => {
  const [params] = useSearchParams();

  return params.get(key);
};

export const useRemoveSearchParam = () => {
  const [params, setSearchParams] = useSearchParams();

  return useCallback(
    (key: string) => {
      params.delete(key);
      setSearchParams(params);
    },
    [params, setSearchParams],
  );
};
