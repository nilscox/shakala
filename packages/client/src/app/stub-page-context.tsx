import { omit } from '@shakala/shared';
import { createContext, Reducer, useContext, useMemo, useReducer } from 'react';

import { PageContext } from '~/renderer/page-context';

import { PageContextProvider } from './page-context';

export type StubPageContext = {
  routeParams: Record<string, string>;
  pathname: string;
  searchParams: Record<string, string>;
  hash: string;
};

type PageContextMutations = {
  setRouteParam: (param: string, value: string) => void;
  setPathname: (pathname: string) => void;
  setSearchParam: (param: string, value: string) => void;
  setHash: (hash: string) => void;
};

const pageContextMutations = createContext<PageContextMutations>(null as never);

export const useMutatePageContext = () => {
  return useContext(pageContextMutations);
};

type StubPageContextProviderProps = Partial<StubPageContext> & {
  children: React.ReactNode;
};

export const StubPageContextProvider = ({ children, ...props }: StubPageContextProviderProps) => {
  const [pageContext, mutations] = useStubPageContext(props);

  return (
    <pageContextMutations.Provider value={mutations}>
      <PageContextProvider value={pageContext}>{children}</PageContextProvider>
    </pageContextMutations.Provider>
  );
};

const useStubPageContext = ({
  routeParams = {},
  pathname = '/',
  searchParams = {},
  hash = '',
}: Partial<StubPageContext>): [PageContext, PageContextMutations] => {
  const [stubPageContext, dispatch] = useReducer(reducer, {
    routeParams,
    pathname,
    searchParams,
    hash,
  });

  const pageContext = useMemo<PageContext>(() => {
    return {
      routeParams: stubPageContext.routeParams,
      urlPathname: stubPageContext.pathname,
      urlParsed: {
        searchOriginal: new URLSearchParams(stubPageContext.searchParams).toString(),
        hash: stubPageContext.hash,
      },
    } as PageContext;
  }, [stubPageContext]);

  const mutations = useMemo<PageContextMutations>(
    () => ({
      setRouteParam: (param, value) => dispatch({ type: RouterMutation.setRouteParam, param, value }),
      setPathname: (pathname) => dispatch({ type: RouterMutation.setPathname, pathname }),
      setSearchParam: (param, value) => dispatch({ type: RouterMutation.setSearchParam, param, value }),
      setHash: (hash) => dispatch({ type: RouterMutation.setHash, hash }),
    }),
    [dispatch]
  );

  return [pageContext, mutations];
};

enum RouterMutation {
  setRouteParam = 'setRouteParam',
  setPathname = 'setPathname',
  setSearchParam = 'setSearchParam',
  setHash = 'setHash',
}

type SetRouteParam = {
  type: RouterMutation.setRouteParam;
  param: string;
  value: string;
};

type SetPathname = {
  type: RouterMutation.setPathname;
  pathname: string;
};

type SetSearchParam = {
  type: RouterMutation.setSearchParam;
  param: string;
  value: string | undefined;
};

type SetHash = {
  type: RouterMutation.setHash;
  hash: string;
};

type Actions = SetRouteParam | SetPathname | SetSearchParam | SetHash;

const reducer: Reducer<StubPageContext, Actions> = (state, action) => {
  switch (action.type) {
    case RouterMutation.setRouteParam:
      return { ...state, routeParams: { ...state.routeParams, [action.param]: action.value } };

    case RouterMutation.setPathname:
      return { ...state, pathname: action.pathname };

    case RouterMutation.setSearchParam: {
      if (action.value !== undefined) {
        return { ...state, searchParams: { ...state.searchParams, [action.param]: action.value } };
      } else {
        return { ...state, searchParams: omit(state.searchParams, action.param) };
      }
    }

    case RouterMutation.setHash:
      return { ...state, hash: action.hash };

    default:
      return state;
  }
};
