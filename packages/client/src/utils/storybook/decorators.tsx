import { action } from '@storybook/addon-actions';
import { Decorator } from '@storybook/react';
import { ContainerProvider } from 'brandi-react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubCommentAdapter } from '~/adapters/api/comment/stub-comment.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { RouterPort } from '~/adapters/router/router.port';
import { container } from '~/app/container';
import { PageContextProvider } from '~/app/page-context';
import { TOKENS } from '~/app/tokens';
import { SnackbarProvider } from '~/elements/snackbar';

export const maxWidthDecorator: Decorator = (Story) => (
  <div className="max-w-6">
    <Story />
  </div>
);

export const snackbarDecorator: Decorator = (Story) => (
  <SnackbarProvider>
    <Story />
  </SnackbarProvider>
);

export const pageContextDecorator: Decorator = (Story, { parameters }) => (
  <PageContextProvider value={parameters.pageContext ?? {}}>
    <Story />
  </PageContextProvider>
);

export const queryClientDecorator: Decorator = (Story) => (
  <QueryClientProvider client={new QueryClient()}>
    <Story />
  </QueryClientProvider>
);

class StorybookRouterAdapter implements RouterPort {
  navigate = action('navigate');
}

export const containerDecorator: Decorator = (Story) => {
  container.bind(TOKENS.router).toInstance(StorybookRouterAdapter).inSingletonScope();
  container.bind(TOKENS.authentication).toInstance(StubAuthenticationAdapter).inSingletonScope();
  container.bind(TOKENS.thread).toInstance(StubThreadAdapter).inSingletonScope();
  container.bind(TOKENS.comment).toInstance(StubCommentAdapter).inSingletonScope();

  return (
    <ContainerProvider container={container}>
      <Story />
    </ContainerProvider>
  );
};
