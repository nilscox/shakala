import { routerActions, routerSelectors } from 'frontend-domain';
import { useCallback } from 'react';

import { useAppDispatch } from './use-app-dispatch';
import { useAppSelector } from './use-app-selector';

export const useSearchParam = (name: string) => {
  return useAppSelector(routerSelectors.queryParam, name);
};

export const useSetSearchParam = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (key: string, value: string | undefined) => {
      if (value === undefined) {
        dispatch(routerActions.removeQueryParam(key));
      } else {
        dispatch(routerActions.setQueryParam([key, value]));
      }
    },
    [dispatch],
  );
};
