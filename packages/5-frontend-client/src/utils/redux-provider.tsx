import { createStore, Dependencies, State, Store } from 'frontend-domain';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';

import { usePathname } from '../hooks/use-pathname';
import { useSearchParams } from '../hooks/use-search-params';

import { productionDependencies } from './production-dependencies';

declare global {
  interface Window {
    dependencies: Dependencies;
    store: Store;
  }
}

type ReduxProviderProps = {
  preloadedState: State;
  children: React.ReactNode;
};

export const ReduxProvider = ({ preloadedState, children }: ReduxProviderProps) => {
  // prevent re-creating a store when changing page in development
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const store = useMemo(() => createStore(productionDependencies, preloadedState), []);

  useEffect(() => {
    window.store = store;
    window.dependencies = productionDependencies;
  }, [store]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    productionDependencies.routerGateway.navigate = (url) => {
      router.push(url, undefined, { shallow: true });
    };
  }, [router]);

  useEffect(() => {
    productionDependencies.routerGateway.pathname = pathname;
  }, [pathname]);

  useEffect(() => {
    productionDependencies.routerGateway.queryParams = searchParams;
  }, [searchParams]);

  return <Provider store={store}>{children}</Provider>;
};
