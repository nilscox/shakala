import { ParsedUrlQuery } from 'querystring';

import { createStore, fetchAuthenticatedUser, selectUserUnsafe, State, Store } from 'frontend-domain';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getServerConfig } from '~/utils/config';
import { productionDependencies } from '~/utils/production-dependencies';

const { apiBaseUrl } = getServerConfig();

type PageProps = {
  state: State;
};

type Options = Partial<{
  authenticated: boolean;
}>;

export const ssr = <Query extends ParsedUrlQuery = ParsedUrlQuery>(
  initialize?: (store: Store, context: GetServerSidePropsContext<Query>) => Promise<void>,
  { authenticated }: Options = {},
): GetServerSideProps<PageProps, Query> => {
  return async (context) => {
    const { req, resolvedUrl } = context;
    const cookie = req.headers.cookie;

    const store = createStore(productionDependencies(apiBaseUrl, cookie));

    if (req.cookies['connect.sid']) {
      await store.dispatch(fetchAuthenticatedUser());
    }

    if (authenticated && !selectUserUnsafe(store.getState())) {
      return {
        redirect: {
          destination: `/?${new URLSearchParams({ auth: 'login', next: resolvedUrl })}`,
          permanent: false,
        },
      };
    }

    await initialize?.(store, context);

    return {
      props: {
        state: store.getState(),
      },
    };
  };
};

ssr.authenticated = <Query extends ParsedUrlQuery = ParsedUrlQuery>(
  initialize?: (store: Store, context: GetServerSidePropsContext<Query>) => Promise<void>,
) => {
  return ssr(initialize, { authenticated: true });
};
