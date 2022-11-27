import { Url } from 'url';

import {
  AppState,
  AppStore,
  createStore,
  Dependencies,
  routerActions,
  routerSelectors,
} from 'frontend-domain';
import globalRouter from 'next/router';
import { useEffect, useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Provider } from 'react-redux';

import { useSnackbar } from '~/elements/snackbar';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import { getPublicConfig } from '~/utils/config';

import { productionDependencies } from './production-dependencies';

declare global {
  interface Window {
    dependencies: Dependencies;
    store: AppStore;
  }
}

const { apiBaseUrl } = getPublicConfig();

type ReduxProviderProps = {
  preloadedState: AppState;
  children: React.ReactNode;
};

export const ReduxProvider = ({ preloadedState, children }: ReduxProviderProps) => {
  const snackbar = useSnackbar();
  const dependencies = useMemo(() => productionDependencies({ apiBaseUrl, snackbar }), [snackbar]);

  // prevent re-creating a store when changing page in development
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const store = useMemo(() => createStore(dependencies, preloadedState), [dependencies]);

  useEffect(() => {
    window.store = store;
    window.dependencies = dependencies;
  }, [store, dependencies]);

  return (
    <Provider store={store}>
      <ConnectRouter />
      {children}
    </Provider>
  );
};

const ConnectRouter = () => {
  useConnectRouterToStore();
  useConnectStoreToRouter();

  return null;
};

const useConnectRouterToStore = () => {
  const dispatch = useAppDispatch();

  const pathname = useAppSelector(routerSelectors.pathname);
  const queryParams = useAppSelector(routerSelectors.queryParams);

  useEffect(() => {
    const handler = () => {
      const url = new URL(`http://localhost${globalRouter.asPath}`);

      if (pathname !== url.pathname) {
        dispatch(routerActions.setPathname(url.pathname));
      }

      const query: Record<string, string> = {};

      for (const [key, value] of url.searchParams.entries()) {
        query[key] = value;
      }

      if (JSON.stringify(queryParams) !== JSON.stringify(query)) {
        dispatch(routerActions.setQueryParams(query as Record<string, string>));
      }
    };

    globalRouter.events.on('routeChangeComplete', handler);
    return () => globalRouter.events.off('routeChangeComplete', handler);
  }, [dispatch, pathname, queryParams]);
};

const useConnectStoreToRouter = () => {
  const pathname = useAppSelector(routerSelectors.pathname);
  const queryParams = useAppSelector(routerSelectors.queryParams);

  useEffect(() => {
    const next: Partial<Url> = {};

    if (globalRouter.pathname === '/404') {
      return;
    }

    if (globalRouter.pathname !== pathname) {
      next.pathname = pathname;
    }

    if (JSON.stringify(globalRouter.query) !== JSON.stringify(queryParams)) {
      next.query = queryParams;
    }

    if (Object.keys(next).length > 0) {
      globalRouter.push(next, undefined, { shallow: true });
    }
  }, [pathname, queryParams]);
};
