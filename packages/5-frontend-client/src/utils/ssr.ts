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
    let error: unknown;

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
      error = caught;
    }

    return {
      props: {
        state: store.getState(),
        error: serializeError(error) ?? null,
      },
    };
  };
};

ssr.authenticated = <Query extends ParsedUrlQuery = ParsedUrlQuery>(
  initialize?: (store: AppStore, context: GetServerSidePropsContext<Query>) => Promise<void>,
) => {
  return ssr(initialize, { authenticated: true });
};

const serializeError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return JSON.stringify(error);
  }

  return {
    ...error,
    name: error.constructor.name,
    message: error.message,
    stack: error.stack,
  };
};
