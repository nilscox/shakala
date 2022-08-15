import { createStore, Dependencies } from 'frontend-domain';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ApiAuthenticationGateway } from './adapters/authentication-gateway/api-authentication.gateway';
import { RealDateGateway } from './adapters/date-gateway/real-date-gateway';
import { FetchHttpGateway } from './adapters/http-gateway/fetch-http.gateway';
import { ConsoleLoggerGateway } from './adapters/logger-gateway/console-logger.gateway';
import { ReactRouterGateway } from './adapters/router-gateway/react-router-gateway';
import { ApiThreadGateway } from './adapters/thread-gateway/api-thread-gateway';
import { RealTimerGateway } from './adapters/timer-gateway/timer-gateway';
import { useSnackbar } from './components/elements/snackbar';
import { useConfig } from './hooks/use-config';
import { Routes } from './routes';
import { ReduxProvider } from './utils/redux-provider';

import '@fontsource/montserrat/latin.css';

import './styles/react-modal.css';
import './styles/tailwind.css';

const useReactRouterGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routerGateway = useRef(new ReactRouterGateway(location, navigate));

  useEffect(() => {
    routerGateway.current.location = location;
  }, [location]);

  useEffect(() => {
    routerGateway.current.navigate = navigate;
  }, [navigate]);

  return routerGateway.current;
};

const useDependencies = () => {
  const config = useConfig();
  const http = useRef(new FetchHttpGateway(config.apiUrl));
  const routerGateway = useReactRouterGateway();
  const snackbarGateway = useSnackbar();

  return useMemo<Dependencies>(
    () => ({
      dateGateway: new RealDateGateway(),
      loggerGateway: new ConsoleLoggerGateway(),
      routerGateway,
      snackbarGateway,
      timerGateway: new RealTimerGateway(),
      authenticationGateway: new ApiAuthenticationGateway(http.current),
      threadGateway: new ApiThreadGateway(http.current),
    }),
    [routerGateway, snackbarGateway],
  );
};

declare global {
  interface Window {
    dependencies: Dependencies;
  }
}

export const App = () => {
  const dependencies = useDependencies();
  const store = useMemo(() => createStore(dependencies), [dependencies]);

  useEffect(() => {
    window.dependencies = dependencies;
  }, [dependencies]);

  return (
    <ReduxProvider store={store}>
      <Routes />
    </ReduxProvider>
  );
};
