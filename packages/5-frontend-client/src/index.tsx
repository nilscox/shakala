import { Dependencies, LocationChange } from 'frontend-domain';
import { useEffect, useMemo, useRef } from 'react';
import * as ReactDOM from 'react-dom/client';
import ReactModal from 'react-modal';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';

import { ApiAuthenticationGateway } from './adapters/authentication-gateway/api-authentication.gateway';
import { FetchHttpGateway } from './adapters/http-gateway/fetch-http.gateway';
import { ConsoleLoggerGateway } from './adapters/logger-gateway/console-logger.gateway';
import { ReactRouterGateway } from './adapters/router-gateway/react-router-gateway';
import { ApiThreadGateway } from './adapters/thread-gateway/thread-gateway';
import { RealTimerGateway } from './adapters/timer-gateway/timer-gateway';
import { SnackbarProvider, useSnackbar } from './components/elements/snackbar/snackbar';
import { useConfig } from './hooks/use-config';
import { Routes } from './routes';
import { ReduxProvider } from './utils/redux-provider';

import '@fontsource/montserrat/latin.css';

import './styles/tailwind.css';
import './styles/react-modal.css';

const useReactRouterGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routerGateway = useRef(new ReactRouterGateway(location, navigate));

  useEffect(() => {
    routerGateway.current.location = location;
    routerGateway.current.emit(LocationChange);
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

const App = () => {
  const dependencies = useDependencies();

  return (
    <ReduxProvider dependencies={dependencies}>
      <Routes />
    </ReduxProvider>
  );
};

const app = document.getElementById('app') as HTMLElement;

ReactModal.setAppElement(app);

ReactDOM.createRoot(app).render(
  <BrowserRouter>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </BrowserRouter>,
);
