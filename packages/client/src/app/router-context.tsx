import { useInjection } from 'brandi-react';
import { createContext, useReducer, useEffect, useContext, Reducer } from 'react';

import { VPSRouterAdapter } from '~/adapters/router/vps-router.adapter';
import { useUpdateEffect } from '~/hooks/use-update-effect';
import { assert } from '~/utils/assert';
import { isClient } from '~/utils/is-server';

import { usePageContext } from './page-context';

type RouterState = {
  pathname: string;
  search: URLSearchParams;
  hash: string | undefined;
};

const routerContext = createContext<RouterState>(null as never);

type RouterProviderProps = {
  children: React.ReactNode;
};

export const RouterProvider = ({ children }: RouterProviderProps) => {
  const routerAdapter = useInjection(TOKENS.router) as VPSRouterAdapter;
  const pageContext = usePageContext();

  const [router, dispatch] = useReducer(routerReducer, {
    pathname: pageContext.urlPathname,
    search: new URLSearchParams(pageContext.urlParsed.searchOriginal ?? ''),
    hash: isClient() ? window.location.hash : undefined,
  });

  useUpdateEffect(() => {
    dispatch({
      type: RouterAction.pathnameChange,
      pathname: pageContext.urlPathname,
    });
  }, [dispatch, pageContext.urlPathname]);

  useUpdateEffect(() => {
    dispatch({
      type: RouterAction.searchChange,
      search: pageContext.urlParsed.searchOriginal ?? undefined,
    });
  }, [dispatch, pageContext.urlParsed.searchOriginal]);

  useEffect(() => {
    return routerAdapter.onHashChange((hash) =>
      dispatch({
        type: RouterAction.hashChange,
        hash,
      })
    );
  }, [routerAdapter]);

  return <routerContext.Provider value={router}>{children}</routerContext.Provider>;
};

export const useRouter = () => {
  const router = useContext(routerContext);

  assert(router);

  return router;
};

enum RouterAction {
  pathnameChange = 'pathnameChange',
  searchChange = 'searchChange',
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

type HashChangeAction = {
  type: RouterAction.hashChange;
  hash: string | undefined;
};

type RouterActions = PathnameChangeAction | SearchChangeAction | HashChangeAction;

const routerReducer: Reducer<RouterState, RouterActions> = (state, action) => {
  switch (action.type) {
    case RouterAction.pathnameChange:
      return { ...state, pathname: action.pathname };

    case RouterAction.searchChange:
      return { ...state, search: new URLSearchParams(action.search) };

    case RouterAction.hashChange:
      return { ...state, hash: action.hash };

    default:
      return state;
  }
};
