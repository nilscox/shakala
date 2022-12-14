import { ParsedUrlQuery } from 'querystring';
import { URL } from 'url';

import {
  AppState,
  AppStore,
  createStore,
  notificationActions,
  routerActions,
  userProfileActions,
  userProfileSelectors,
} from 'frontend-domain';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getServerConfig } from '~/utils/config';
import { productionDependencies } from '~/utils/production-dependencies';

import { HttpError } from '../adapters/http-gateway/http.gateway';

const { apiBaseUrl } = getServerConfig();

export type PageProps = {
  state: AppState;
  error?: unknown;
};

type Options = Partial<{
  authenticated: boolean;
}>;

export const ssr = <Query extends ParsedUrlQuery = ParsedUrlQuery>(
  initialize?: (store: AppStore, context: GetServerSidePropsContext<Query>) => Promise<void>,
  { authenticated }: Options = {},
): GetServerSideProps<PageProps, Query> => {
  return async (context) => {
    const { req, resolvedUrl } = context;
    const cookie = req.headers.cookie;

    const store = createStore(productionDependencies({ apiBaseUrl, cookie }));
    let error: unknown = null;

    try {
      const url = new URL(`http://localhost${resolvedUrl}`);

      store.dispatch(routerActions.setPathname(url.pathname));
      store.dispatch(routerActions.setSearchParams(url.searchParams));

      await store.dispatch(userProfileActions.fetchAuthenticatedUser());
      const user = userProfileSelectors.authenticatedUser(store.getState());

      if (user) {
        await store.dispatch(notificationActions.fetchTotalUnseenNotifications());
      }

      if (authenticated && !user) {
        return {
          redirect: {
            destination: `/?${new URLSearchParams({ auth: 'login', next: resolvedUrl })}`,
            permanent: false,
          },
        };
      }

      await initialize?.(store, context);
    } catch (caught) {
      console.error(caught);
      error = serializeError(caught);
    }

    return {
      props: {
        state: store.getState(),
        error,
      },
    };
  };
};

ssr.authenticated = <Query extends ParsedUrlQuery = ParsedUrlQuery>(
  initialize?: (store: AppStore, context: GetServerSidePropsContext<Query>) => Promise<void>,
) => {
  return ssr(initialize, { authenticated: true });
};

type SsrError = {
  name: string;
  status?: number;
  message?: string;
  details?: unknown;
};

const serializeError = (error: unknown): SsrError => {
  if (error instanceof HttpError) {
    const { response } = error;

    return {
      name: 'HttpError',
      status: response.status,
      details: {
        body: response.body,
      },
    };
  }

  let serialized: object | null;

  try {
    serialized = JSON.parse(JSON.stringify(error));
  } catch {
    serialized = null;
  }

  if (error instanceof Error) {
    return {
      name: error.constructor.name,
      message: error.message,
      details: {
        stack: error.stack,
        error: serialized,
      },
    };
  }

  return {
    name: 'unknown error',
    details: {
      error: serialized,
    },
  };
};
