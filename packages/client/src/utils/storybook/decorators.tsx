import { action } from '@storybook/addon-actions';
import { Decorator } from '@storybook/react';
import { ContainerProvider, useInjection } from 'brandi-react';
import { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { stub } from 'sinon';

import { StubAccountAdapter } from '~/adapters/api/account/stub-account.adapter';
import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubCommentAdapter } from '~/adapters/api/comment/stub-comment.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { RouterPort } from '~/adapters/router/router.port';
import { queryClientConfig } from '~/app/app-providers';
import { container } from '~/app/container';
import { StubPageContextProvider } from '~/app/stub-page-context';
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
  <StubPageContextProvider {...parameters.pageContext}>
    <Story />
  </StubPageContextProvider>
);

export const queryClientDecorator: Decorator = (Story) => (
  <QueryClientProvider client={new QueryClient(queryClientConfig)}>
    <ReactQueryDevtools />
    <Story />
  </QueryClientProvider>
);

export const suspenseDecorator: Decorator = (Story) => (
  <Suspense fallback={<>loading..</>}>
    <Story />
  </Suspense>
);

export class StorybookRouterAdapter implements RouterPort {
  navigate = async () => action('navigate')();
  onHashChange = stub();
}

export const containerDecorator: Decorator = (Story) => {
  container.bind(TOKENS.account).toInstance(StubAccountAdapter).inSingletonScope();
  container.bind(TOKENS.authentication).toInstance(StubAuthenticationAdapter).inSingletonScope();
  container.bind(TOKENS.comment).toInstance(StubCommentAdapter).inSingletonScope();
  container.bind(TOKENS.router).toInstance(StorybookRouterAdapter).inSingletonScope();
  container.bind(TOKENS.thread).toInstance(StubThreadAdapter).inSingletonScope();

  return (
    <ContainerProvider container={container}>
      <Story />
    </ContainerProvider>
  );
};

export const trapLinksDecorator: Decorator = (Story) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useTrapLinks();
  return <Story />;
};

const trapLinks = (router: RouterPort) => {
  const observer = new MutationObserver(() => {
    for (const link of document.getElementsByTagName('a')) {
      if (link.getAttribute('data-sb-link-trap') === 'true') {
        continue;
      }

      link.setAttribute('data-sb-link-trap', 'true');

      link.addEventListener('click', (event) => {
        event.preventDefault();

        const target = event.target as HTMLAnchorElement;
        const href = target.getAttribute('href');

        if (href) {
          router.navigate(href);
        }
      });
    }
  });

  observer.observe(document.body, { subtree: true, childList: true });

  return () => observer.disconnect();
};

// avoid links to navigate out of the story
const useTrapLinks = () => {
  const router = useInjection(TOKENS.router);

  useEffect(() => {
    return trapLinks(router);
  }, [router]);
};
