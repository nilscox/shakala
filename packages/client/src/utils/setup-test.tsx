import { render as renderTL } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContainerProvider } from 'brandi-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { beforeEach } from 'vitest';

import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubCommentAdapter } from '~/adapters/api/comment/stub-comment.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { StubRouterAdapter } from '~/adapters/router/stub-router.adapter';
import { container } from '~/app/container';
import { PageContextProvider } from '~/app/page-context';
import { TOKENS } from '~/app/tokens';
import { SnackbarProvider } from '~/elements/snackbar';
import { PageContext } from '~/renderer/page-context';

export const setupTest = () => {
  let pageContext: PageContext = {} as PageContext;
  let queryClient: QueryClient;

  const adapters = {
    router: new StubRouterAdapter(),
    authenticationAdapter: new StubAuthenticationAdapter(),
    threadAdapter: new StubThreadAdapter(),
    commentAdapter: new StubCommentAdapter(),
  };

  beforeEach(() => {
    pageContext = {} as PageContext;
    queryClient = new QueryClient();

    container.bind(TOKENS.router).toConstant(adapters.router);
    container.bind(TOKENS.authentication).toConstant(adapters.authenticationAdapter);
    container.bind(TOKENS.thread).toConstant(adapters.threadAdapter);
    container.bind(TOKENS.comment).toConstant(adapters.commentAdapter);
  });

  const setPageContext = (ctx: Partial<PageContext>) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    pageContext = ctx as PageContext;
  };

  const setRouteParam = (param: string, value: string) => {
    setPageContext({
      ...pageContext,
      routeParams: {
        ...pageContext.routeParams,
        [param]: value,
      },
    });
  };

  const render = (ui: React.ReactElement) => {
    const user = userEvent.setup();

    renderTL(ui, {
      wrapper: ({ children }) => {
        return (
          <ContainerProvider container={container}>
            <PageContextProvider value={pageContext}>
              <QueryClientProvider client={queryClient}>
                <SnackbarProvider>{children}</SnackbarProvider>
              </QueryClientProvider>
            </PageContextProvider>
          </ContainerProvider>
        );
      },
    });

    return user;
  };

  return {
    render,
    setRouteParam,
    ...adapters,
  };
};
