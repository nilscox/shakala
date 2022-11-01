import { ParsedUrlQuery } from 'querystring';

import { createStore, State, Store } from 'frontend-domain';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { productionDependencies } from '~/utils/production-dependencies';

type PageProps = {
  state: State;
};

export const ssr = <Query extends ParsedUrlQuery = ParsedUrlQuery>(
  initialize: (store: Store, context: GetServerSidePropsContext<Query>) => Promise<void>,
): GetServerSideProps<PageProps, Query> => {
  return async (context) => {
    const store = createStore(productionDependencies);

    await initialize(store, context);

    return {
      props: {
        state: store.getState(),
      },
    };
  };
};
