import { render as renderTL, renderHook as renderHookTL } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContainerProvider } from 'brandi-react';
import { QueryClient, QueryClientProvider, QueryKey } from 'react-query';
import { beforeEach } from 'vitest';

import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubCommentAdapter } from '~/adapters/api/comment/stub-comment.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { StubRouterAdapter } from '~/adapters/router/stub-router.adapter';
import { queryClientConfig } from '~/app/app-providers';
import { container } from '~/app/container';
import { PageContextProvider } from '~/app/page-context';
import { RouterProvider } from '~/app/router-context';
import { TOKENS } from '~/app/tokens';
import { SnackbarProvider } from '~/elements/snackbar';
import { PageContext } from '~/renderer/page-context';

type StubAdapters = {
  router: StubRouterAdapter;
  authentication: StubAuthenticationAdapter;
  thread: StubThreadAdapter;
  comment: StubCommentAdapter;
};

export const setupTest = () => {
  let pageContext: PageContext = {} as PageContext;
  let queryClient: QueryClient;

  const adapters = {} as StubAdapters;

  beforeEach(() => {
    pageContext = { urlParsed: {} } as PageContext;
    queryClient = new QueryClient(queryClientConfig);

    Object.assign(adapters, {
      router: new StubRouterAdapter(),
      authentication: new StubAuthenticationAdapter(),
      thread: new StubThreadAdapter(),
      comment: new StubCommentAdapter(),
    });

    container.bind(TOKENS.router).toConstant(adapters.router);
    container.bind(TOKENS.authentication).toConstant(adapters.authentication);
    container.bind(TOKENS.thread).toConstant(adapters.thread);
    container.bind(TOKENS.comment).toConstant(adapters.comment);
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

  const setSearchParam = (param: string, value: string) => {
    const searchParams = new URLSearchParams(pageContext.urlParsed.searchOriginal ?? '');

    searchParams.set(param, value);

    setPageContext({
      ...pageContext,
      urlParsed: {
        ...pageContext.urlParsed,
        searchOriginal: '?' + searchParams.toString(),
      },
    });
  };

  const setQueryData = (queryKey: QueryKey, data: unknown) => {
    queryClient.setQueryData(queryKey, data);
  };

  const wrapper = ({ children }: { children: JSX.Element }) => (
    <ContainerProvider container={container}>
      <PageContextProvider value={pageContext}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </RouterProvider>
        </QueryClientProvider>
      </PageContextProvider>
    </ContainerProvider>
  );

  const render = (ui: React.ReactElement) => {
    const user = userEvent.setup();

    const result = renderTL(ui, { wrapper });

    return { ...user, ...result };
  };

  const renderHook = <Props, Result>(hook: (initialProps: Props) => Result) => {
    return renderHookTL(hook, { wrapper });
  };

  return {
    render,
    renderHook,
    setRouteParam,
    setSearchParam,
    setQueryData,
    adapters,
  };
};
