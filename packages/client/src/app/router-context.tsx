import { assert } from '@shakala/shared';
import { useInjection } from 'brandi-react';
import { createContext, Reducer, useCallback, useContext, useEffect, useReducer } from 'react';

import { VPSRouterAdapter } from '~/adapters/router/vps-router.adapter';
import { useUpdateEffect } from '~/hooks/use-update-effect';
import { isClient } from '~/utils/is-server';

import { usePageContext } from './page-context';

export type RouterState = {
  pathname: string;
  searchParams: URLSearchParams;
  hash: string | undefined;
};

export type RouterContext = RouterState & {
  setPathname: (pathname: string) => void;
  setSearchParam: (key: string, value: string) => void;
  setHash: (value: string | undefined) => void;
};

const routerContext = createContext<RouterContext>(null as never);

type RouterProviderProps = {
  children: React.ReactNode;
};

export const RouterProvider = ({ children }: RouterProviderProps) => {
  const routerAdapter = useInjection(TOKENS.router) as VPSRouterAdapter;
  const pageContext = usePageContext();

  const [routerState, dispatch] = useReducer(routerReducer, {
    pathname: pageContext.urlPathname,
    searchParams: new URLSearchParams(pageContext.urlParsed.searchOriginal ?? ''),
    hash: isClient() ? window.location.hash : undefined,
  });

  const setPathname = useCallback<RouterContext['setPathname']>((pathname) => {
    dispatch({ type: RouterAction.pathnameChange, pathname });
  }, []);

  const setSearch = useCallback((search: string | undefined) => {
    dispatch({ type: RouterAction.searchChange, search });
  }, []);

  const setSearchParam = useCallback<RouterContext['setSearchParam']>((key, value) => {
    dispatch({ type: RouterAction.searchParamChange, key, value });
  }, []);

  const setHash = useCallback<RouterContext['setHash']>((hash) => {
    dispatch({ type: RouterAction.hashChange, hash });
  }, []);

  useUpdateEffect(() => {
    setPathname(pageContext.urlPathname);
  }, [dispatch, pageContext.urlPathname]);

  useUpdateEffect(() => {
    setSearch(pageContext.urlParsed.searchOriginal ?? undefined);
  }, [dispatch, pageContext.urlParsed.searchOriginal]);

  useEffect(() => {
    return routerAdapter.onHashChange(setHash);
  }, [routerAdapter, setHash]);

  const value: RouterContext = {
    ...routerState,
    setPathname,
    setSearchParam,
    setHash,
  };

  return <RouterStateProvider value={value}>{children}</RouterStateProvider>;
};

export const RouterStateProvider = routerContext.Provider;

export const useRouter = () => {
  const router = useContext(routerContext);

  assert(router);

  return router;
};

enum RouterAction {
  pathnameChange = 'pathnameChange',
  searchChange = 'searchChange',
  searchParamChange = 'searchParamChange',
  hashChange = 'hashChange',
}

type PathnameChangeAction = {
  type: RouterAction.pathnameChange;
  pathname: string;
};

type SearchChangeAction = {
  type: RouterAction.searchChange;
  search: string | undefined;
};

type SearchParamChangeAction = {
  type: RouterAction.searchParamChange;
  key: string;
  value: string | undefined;
};

type HashChangeAction = {
  type: RouterAction.hashChange;
  hash: string | undefined;
};

type RouterActions = PathnameChangeAction | SearchChangeAction | SearchParamChangeAction | HashChangeAction;

const routerReducer: Reducer<RouterState, RouterActions> = (state, action) => {
  switch (action.type) {
    case RouterAction.pathnameChange:
      return { ...state, pathname: action.pathname };

    case RouterAction.searchChange:
      return { ...state, searchParams: new URLSearchParams(action.search) };

    case RouterAction.searchParamChange: {
      const { key, value } = action;
      const searchParams = new URLSearchParams(state.searchParams);

      if (value !== undefined) {
        searchParams.append(key, value);
      } else {
        searchParams.delete(key);
      }

      return { ...state, searchParams };
    }

    case RouterAction.hashChange:
      return { ...state, hash: action.hash };

    default:
      return state;
  }
};
