'use client';

import { composeWithDevTools } from '@redux-devtools/extension';
import { Dependencies, rootReducer, State } from 'frontend-domain';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { legacy_createStore as createReduxStore, applyMiddleware, AnyAction } from 'redux';
import thunkMiddleware, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';

import { FetchHttpGateway } from '../adapters/http-gateway/fetch-http.gateway';
import { NextRouterGateway } from '../adapters/router-gateway/next-router-gateway';
import { LocalStorageGateway } from '../adapters/storage-gateway/local-storage-gateway';
import { ApiThreadGateway } from '../adapters/thread-gateway/api-thread-gateway';

const http = new FetchHttpGateway('http://localhost:3000');

const storageGateway = new LocalStorageGateway();
const routerGateway = new NextRouterGateway();

const deps: Dependencies = {
  storageGateway,
  routerGateway,
  threadGateway: new ApiThreadGateway(http),
};

type ReduxProviderProps = {
  children: React.ReactNode;
};

export const ReduxProvider = ({ children }: ReduxProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    routerGateway.navigate = router.push;
  }, [router]);

  useEffect(() => {
    routerGateway.pathname = pathname;
  }, [pathname]);

  return <Provider store={createStore(deps)}>{children}</Provider>;
};

type AppThunkMiddleware = ThunkMiddleware<State, AnyAction, Dependencies>;
type AppThunkDispatch = ThunkDispatch<State, Dependencies, AnyAction>;

export const createStore = (dependencies: Dependencies) => {
  const enhancer = applyMiddleware<AppThunkDispatch>(
    thunkMiddleware.withExtraArgument(dependencies) as AppThunkMiddleware,
  );

  return createReduxStore(rootReducer, composeWithDevTools(enhancer) as typeof enhancer);
};