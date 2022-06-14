import { action } from '@storybook/addon-actions';
import { DecoratorFn } from '@storybook/react';
import { Dependencies, RemoveListener, RouterGateway } from 'frontend-domain';
import { useMemo } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { StorybookAuthenticationGateway } from '~/adapters/authentication-gateway/storybook-authentication.gateway';
import { StorybookThreadGateway } from '~/adapters/thread-gateway/storybook-thread.gateway';
import { RealTimerGateway } from '~/adapters/timer-gateway/timer-gateway';

import { ReduxProvider } from './redux-provider';

export const routerDecorator = (initialEntry?: string) => {
  const StorybookRouterDecorator: DecoratorFn = (Story) => (
    <MemoryRouter initialEntries={initialEntry ? [initialEntry] : undefined}>
      <Story />
    </MemoryRouter>
  );

  return StorybookRouterDecorator;
};

class StorybookRouterGateway implements RouterGateway {
  getQueryParam(key: string): string | undefined {
    action('StorybookRouterGateway.getQueryParam')(key);
    return;
  }

  removeQueryParam(key: string): void {
    action('StorybookRouterGateway.removeQueryParam')(key);
  }

  onLocationChange(): RemoveListener {
    return () => {};
  }
}

export const reduxDecorator = () => {
  const StorybookReduxProvider: DecoratorFn = (Story) => {
    const dependencies = useMemo<Dependencies>(
      () => ({
        routerGateway: new StorybookRouterGateway(),
        timerGateway: new RealTimerGateway(),
        authenticationGateway: new StorybookAuthenticationGateway(),
        threadGateway: new StorybookThreadGateway(),
      }),
      [],
    );

    return (
      <ReduxProvider dependencies={dependencies}>
        <Story />
      </ReduxProvider>
    );
  };

  return StorybookReduxProvider;
};
