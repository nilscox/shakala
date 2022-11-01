import { createStore, Dependencies, State, Store } from 'frontend-domain';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';

import { getClientConfig } from '~/utils/config';

import { usePathname } from '../hooks/use-pathname';
import { useSearchParams } from '../hooks/use-search-params';

import { productionDependencies } from './production-dependencies';

declare global {
  interface Window {
    dependencies: Dependencies;
    store: Store;
  }
}

const { apiBaseUrl } = getClientConfig();

type ReduxProviderProps = {
  preloadedState: State;
  children: React.ReactNode;
};

export const ReduxProvider = ({ preloadedState, children }: ReduxProviderProps) => {
  const dependencies = useMemo(() => productionDependencies(apiBaseUrl), []);

  // prevent re-creating a store when changing page in development
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const store = useMemo(() => createStore(dependencies, preloadedState), []);

  useEffect(() => {
    window.store = store;
    window.dependencies = dependencies;
  }, [store, dependencies]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    dependencies.routerGateway.navigate = (url) => {
      router.push(url, undefined, { shallow: true });
    };
  }, [dependencies, router]);

  useEffect(() => {
    dependencies.routerGateway.pathname = pathname;
  }, [dependencies, pathname]);

  useEffect(() => {
    dependencies.routerGateway.queryParams = searchParams;
  }, [dependencies, searchParams]);

  return <Provider store={store}>{children}</Provider>;
};
