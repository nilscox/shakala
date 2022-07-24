import { action } from '@storybook/addon-actions';
import { DecoratorFn } from '@storybook/react';
import {
  createStore,
  Dependencies,
  Dispatch,
  RemoveListener,
  RouterGateway,
  SnackbarGateway,
} from 'frontend-domain';
import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { StorybookAuthenticationGateway } from '~/adapters/authentication-gateway/storybook-authentication.gateway';
import { RealDateGateway } from '~/adapters/date-gateway/real-date-gateway';
import { ConsoleLoggerGateway } from '~/adapters/logger-gateway/console-logger.gateway';
import { StorybookThreadGateway } from '~/adapters/thread-gateway/storybook-thread.gateway';
import { RealTimerGateway } from '~/adapters/timer-gateway/timer-gateway';
import { useSnackbar, SnackbarProvider } from '~/components/elements/snackbar';

export const maxWidthDecorator = () => {
  const MaxWidthDecorator: DecoratorFn = (Story) => (
    <div className="max-w-page">
      <Story />
    </div>
  );

  return MaxWidthDecorator;
};

export const routerDecorator = (initialEntry?: string) => {
  const StorybookRouterDecorator: DecoratorFn = (Story) => (
    <MemoryRouter initialEntries={initialEntry ? [initialEntry] : undefined}>
      <Story />
    </MemoryRouter>
  );

  return StorybookRouterDecorator;
};

export const snackbarDecorator = () => {
  const SnackbarDecorator: DecoratorFn = (Story) => (
    <SnackbarProvider>
      <Story />
    </SnackbarProvider>
  );

  return SnackbarDecorator;
};

class StorybookRouterGateway implements RouterGateway {
  navigate(to: string): void {
    action('StorybookRouterGateway.navigate')(to);
  }

  getQueryParam(key: string): string | undefined {
    action('StorybookRouterGateway.getQueryParam')(key);
    return;
  }

  setQueryParam(key: string, value: string): void {
    action('StorybookRouterGateway.setQueryParam')(key, value);
  }

  removeQueryParam(key: string): void {
    action('StorybookRouterGateway.removeQueryParam')(key);
  }

  onLocationChange(): RemoveListener {
    return () => {};
  }
}

interface StorybookDependencies extends Dependencies {
  dateGateway: RealDateGateway;
  snackbarGateway: SnackbarGateway;
  loggerGateway: ConsoleLoggerGateway;
  routerGateway: StorybookRouterGateway;
  timerGateway: RealTimerGateway;
  authenticationGateway: StorybookAuthenticationGateway;
  threadGateway: StorybookThreadGateway;
}

export type SetupRedux = (dispatch: Dispatch, deps: StorybookDependencies) => void;

export const reduxDecorator = () => {
  const StorybookReduxProvider: DecoratorFn = (Story, context: { args: { setup?: SetupRedux } }) => {
    const snackbar = useSnackbar();

    const dependencies = useMemo<StorybookDependencies>(
      () => ({
        dateGateway: new RealDateGateway(),
        snackbarGateway: snackbar,
        loggerGateway: new ConsoleLoggerGateway(),
        routerGateway: new StorybookRouterGateway(),
        timerGateway: new RealTimerGateway(),
        authenticationGateway: new StorybookAuthenticationGateway(),
        threadGateway: new StorybookThreadGateway(),
      }),
      [snackbar],
    );

    const store = useMemo(() => createStore(dependencies), [dependencies]);
    const { setup } = context.args;

    const [ready, setReady] = useState(false);

    useEffect(() => {
      setup?.(store.dispatch, dependencies);
      setReady(true);
    }, [setup, store, dependencies]);

    if (!ready) {
      return <></>;
    }

    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  };

  return StorybookReduxProvider;
};
