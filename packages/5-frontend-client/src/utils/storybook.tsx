import { Args, Decorator, StoryFn } from '@storybook/react';
import {
  AppState,
  createStore,
  createStubDependencies,
  Dependencies,
  SnackbarGateway,
  StubAuthenticationGateway,
  StubCommentGateway,
  StubDraftsGateway,
  StubNotificationGateway,
  StubThreadGateway,
  StubUserProfileGateway,
} from 'frontend-domain';
import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Provider } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { EnumType } from 'shared';

import { RealDateGateway } from '~/adapters/date-gateway/real-date-gateway';
import { ConsoleLoggerGateway } from '~/adapters/logger-gateway/console-logger.gateway';
import { RealTimerGateway } from '~/adapters/timer-gateway/timer-gateway';
import { SnackbarProvider, useSnackbar } from '~/elements/snackbar';

export const controls = {
  text: (defaultValue: string) => ({
    control: 'text',
    defaultValue,
  }),
  boolean: (defaultValue: boolean) => ({
    control: 'boolean',
    defaultValue,
  }),
  range: (defaultValue: number, options: Partial<Record<'min' | 'max' | 'step', number>> = {}) => ({
    control: { type: 'range', ...options },
    defaultValue,
  }),
  inlineRadio: (options: string[], defaultValue: string) => ({
    control: 'inline-radio',
    options,
    defaultValue,
  }),
  enum: <T extends string>(enumObject: EnumType<T>, defaultValue?: T) => ({
    control: 'inline-radio',
    options: Object.values(enumObject),
    defaultValue,
  }),
  disabled: () => ({
    table: { disable: true },
  }),
};

export const maxWidthDecorator = () => {
  const MaxWidthDecorator: Decorator = (Story) => (
    <div className="max-w-6">
      <Story />
    </div>
  );

  return MaxWidthDecorator;
};

export const snackbarDecorator = () => {
  const SnackbarDecorator: Decorator = (Story) => (
    <SnackbarProvider>
      <Story />
    </SnackbarProvider>
  );

  return SnackbarDecorator;
};

interface StorybookDependencies extends Dependencies {
  authenticationGateway: StubAuthenticationGateway;
  commentGateway: StubCommentGateway;
  dateGateway: RealDateGateway;
  draftsGateway: StubDraftsGateway;
  loggerGateway: ConsoleLoggerGateway;
  notificationGateway: StubNotificationGateway;
  snackbarGateway: SnackbarGateway;
  timerGateway: RealTimerGateway;
  threadGateway: StubThreadGateway;
  userProfileGateway: StubUserProfileGateway;
}

export type SetupRedux<TArgs = Args> = ThunkAction<
  void,
  AppState,
  StorybookDependencies & { args: TArgs },
  AnyAction
>;

export type ReduxStory<TArgs = Args> = StoryFn<TArgs & { setup: SetupRedux<TArgs> }>;

export const reduxDecorator = () => {
  const StoryFnbookReduxProvider: Decorator = (Story, context: { args: Args }) => {
    const snackbar = useSnackbar();

    const dependencies = useMemo<StorybookDependencies>(
      () => ({
        ...createStubDependencies(),
        dateGateway: new RealDateGateway(),
        snackbarGateway: snackbar,
        loggerGateway: new ConsoleLoggerGateway(),
        timerGateway: new RealTimerGateway(),
      }),
      [snackbar],
    );

    const store = useMemo(() => createStore(dependencies), [dependencies]);

    const { setup } = context.args ?? {};
    const [ready, setReady] = useState(!setup);

    useEffect(() => {
      if (setup) {
        setup(store.dispatch, store.getState, { ...dependencies, args: context.args });
      }

      setReady(true);
    }, [setup, store, dependencies, context.args]);

    if (!ready) {
      return <></>;
    }

    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  };

  return StoryFnbookReduxProvider;
};
