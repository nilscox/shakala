import { Factory, UserDto } from '@shakala/shared';
import { renderHook as renderHookTL, render as renderTL } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContainerProvider } from 'brandi-react';
import { QueryClient, QueryClientProvider, QueryKey, setLogger } from 'react-query';
import { beforeEach } from 'vitest';

import { StubAccountAdapter } from '~/adapters/api/account/stub-account.adapter';
import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubCommentAdapter } from '~/adapters/api/comment/stub-comment.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { HttpError } from '~/adapters/http/http-error';
import { HttpRequest, HttpResponse } from '~/adapters/http/http.port';
import { RichTextEditor } from '~/adapters/rich-text-editor/rich-text-editor.port';
import { stubRichTextEditor } from '~/adapters/rich-text-editor/stub-rich-text-editor.adapter';
import { StubRouterAdapter } from '~/adapters/router/stub-router.adapter';
import { queryClientConfig } from '~/app/app-providers';
import { container } from '~/app/container';
import { StubPageContext, StubPageContextProvider } from '~/app/stub-page-context';
import { TOKENS } from '~/app/tokens';
import { SnackbarProvider } from '~/elements/snackbar';

import { getQueryKey } from './query-key';

type StubAdapters = {
  richTextEditor: RichTextEditor;
  router: StubRouterAdapter;
  account: StubAccountAdapter;
  authentication: StubAuthenticationAdapter;
  thread: StubThreadAdapter;
  comment: StubCommentAdapter;
};

export const setupTest = () => {
  let pageContext: Partial<StubPageContext>;
  let queryClient: QueryClient;

  const adapters = {} as StubAdapters;

  beforeEach(() => {
    pageContext = {};
    queryClient = new QueryClient(queryClientConfig);

    const noop = () => {};
    setLogger({ log: noop, warn: noop, error: noop });

    Object.assign(adapters, {
      richTextEditor: stubRichTextEditor,
      router: new StubRouterAdapter(),
      account: new StubAccountAdapter(),
      authentication: new StubAuthenticationAdapter(),
      thread: new StubThreadAdapter(),
      comment: new StubCommentAdapter(),
    });

    container.bind(TOKENS.richTextEditor).toConstant(adapters.richTextEditor);
    container.bind(TOKENS.router).toConstant(adapters.router);
    container.bind(TOKENS.account).toConstant(adapters.account);
    container.bind(TOKENS.authentication).toConstant(adapters.authentication);
    container.bind(TOKENS.thread).toConstant(adapters.thread);
    container.bind(TOKENS.comment).toConstant(adapters.comment);
  });

  const setRouteParam = (param: string, value: string) => {
    pageContext.routeParams ??= {};
    pageContext.routeParams[param] = value;
  };

  const setSearchParam = (param: string, value: string | undefined) => {
    pageContext.searchParams ??= {};

    if (value === undefined) {
      delete pageContext.searchParams[param];
    } else {
      pageContext.searchParams[param] = value;
    }
  };

  const setQueryData = (queryKey: QueryKey, data: unknown) => {
    queryClient.setQueryData(queryKey, data);
  };

  const setUser = (user: UserDto) => {
    setQueryData(getQueryKey(TOKENS.authentication, 'getAuthenticatedUser'), user);
  };

  const wrapper = ({ children }: { children: JSX.Element }) => (
    <ContainerProvider container={container}>
      <StubPageContextProvider {...pageContext}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>{children}</SnackbarProvider>
        </QueryClientProvider>
      </StubPageContextProvider>
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
    setUser,
    adapters,
  };
};

export const mockHttpError: Factory<HttpError> = (overrides) => {
  const request = {} as HttpRequest;
  const response = {} as HttpResponse;

  return Object.assign(new HttpError(request, response), overrides);
};
