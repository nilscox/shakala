import { action } from '@storybook/addon-actions';
import { DecoratorFn } from '@storybook/react';
import {
  createStore,
  Dependencies,
  Dispatch,
  DraftCommentKind,
  SnackbarGateway,
  StorageGateway,
} from 'frontend-domain';
import { createMemoryHistory } from 'history';
import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { StorybookAuthenticationGateway } from '~/adapters/authentication-gateway/storybook-authentication.gateway';
import { RealDateGateway } from '~/adapters/date-gateway/real-date-gateway';
import { ConsoleLoggerGateway } from '~/adapters/logger-gateway/console-logger.gateway';
import { ReactRouterGateway } from '~/adapters/router-gateway/react-router-gateway';
import { StorybookThreadGateway } from '~/adapters/thread-gateway/storybook-thread.gateway';
import { RealTimerGateway } from '~/adapters/timer-gateway/timer-gateway';
import { StorybookUserGateway } from '~/adapters/user-gateway/storybook-user.gateway';
import { useReactRouterGateway } from '~/app';
import { SnackbarProvider, useSnackbar } from '~/components/elements/snackbar';

export const controls = {
  inlineRadio: (options: string[], defaultValue: string) => ({
    control: 'inline-radio',
    options,
    defaultValue,
  }),
  boolean: (defaultValue: boolean) => ({
    control: 'boolean',
    defaultValue,
  }),
  disabled: () => ({
    table: { disable: true },
  }),
};

export const maxWidthDecorator = () => {
  const MaxWidthDecorator: DecoratorFn = (Story) => (
    <div className="max-w-6">
      <Story />
    </div>
  );

  return MaxWidthDecorator;
};

export const routerDecorator = (history = createMemoryHistory()) => {
  const StorybookRouterDecorator: DecoratorFn = (Story) => (
    <Router location={history.location} navigator={history}>
      <Story />
    </Router>
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

class StorybookStorageGateway implements StorageGateway {
  async getDraftCommentText(kind: DraftCommentKind, id: string): Promise<string | undefined> {
    action('StorybookStorageGateway.getDraftCommentText')(kind, id);
    return;
  }

  async setDraftCommentText(kind: DraftCommentKind, id: string, text: string): Promise<void> {
    action('StorybookStorageGateway.setDraftCommentText')(kind, id, text);
  }

  async removeDraftCommentText(kind: DraftCommentKind, id: string): Promise<void> {
    action('StorybookStorageGateway.removeDraftCommentText')(kind, id, id);
  }
}

interface StorybookDependencies extends Dependencies {
  dateGateway: RealDateGateway;
  snackbarGateway: SnackbarGateway;
  loggerGateway: ConsoleLoggerGateway;
  routerGateway: ReactRouterGateway;
  timerGateway: RealTimerGateway;
  authenticationGateway: StorybookAuthenticationGateway;
  threadGateway: StorybookThreadGateway;
  storageGateway: StorybookStorageGateway;
  userGateway: StorybookUserGateway;
}

export type SetupRedux = (dispatch: Dispatch, deps: StorybookDependencies) => void;

export const reduxDecorator = () => {
  const StorybookReduxProvider: DecoratorFn = (Story, context: { args: { setup?: SetupRedux } }) => {
    const snackbar = useSnackbar();
    const routerGateway = useReactRouterGateway();

    const dependencies = useMemo<StorybookDependencies>(
      () => ({
        dateGateway: new RealDateGateway(),
        snackbarGateway: snackbar,
        loggerGateway: new ConsoleLoggerGateway(),
        routerGateway,
        timerGateway: new RealTimerGateway(),
        authenticationGateway: new StorybookAuthenticationGateway(),
        threadGateway: new StorybookThreadGateway(),
        storageGateway: new StorybookStorageGateway(),
        userGateway: new StorybookUserGateway(),
      }),
      [snackbar, routerGateway],
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
