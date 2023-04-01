import { action } from '@storybook/addon-actions';
import { Decorator } from '@storybook/react';
import { ContainerProvider, useInjection } from 'brandi-react';
import { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { stub } from 'sinon';

import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubCommentAdapter } from '~/adapters/api/comment/stub-comment.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { RouterPort } from '~/adapters/router/router.port';
import { queryClientConfig } from '~/app/app-providers';
import { container } from '~/app/container';
import { PageContextProvider } from '~/app/page-context';
import { RouterContext, RouterProvider, useRouter } from '~/app/router-context';
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
  <PageContextProvider
    value={{
      urlPathname: '/',
      urlParsed: {},
      ...parameters.pageContext,
    }}
  >
    <Story />
  </PageContextProvider>
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

type StorybookRouterState = RouterContext & {
  setPathname(pathname: string): void;
  setSearchParam(key: string, value: string): void;
  setHash(hash: string | undefined): void;
};

type StorybookRouterProviderProps = {
  children: React.ReactNode;
};

const StorybookRouterProvider = ({ children }: StorybookRouterProviderProps) => {
  useTrapLinks();
  return <RouterProvider>{children}</RouterProvider>;
};

// avoid links to navigate out of the story
const useTrapLinks = () => {
  const router = useInjection(TOKENS.router);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      for (const link of document.getElementsByTagName('a')) {
        if (link.getAttribute('data-sb-link-trap') === 'true') {
          return;
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
  }, [router]);
};

export const useStorybookRouter = () => {
  return useRouter() as StorybookRouterState;
};

export const routerDecorator: Decorator = (Story) => (
  <StorybookRouterProvider>
    <Story />
  </StorybookRouterProvider>
);

export class StorybookRouterAdapter implements RouterPort {
  navigate = action('navigate');
  onHashChange = stub();
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
