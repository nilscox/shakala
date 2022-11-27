import { Actions } from '@nilscox/redux-kooltik';

export type RouterState = {
  pathname: string;
  queryParams: Partial<Record<string, string>>;
};

class RouterActions extends Actions<RouterState> {
  constructor() {
    super('router', {
      pathname: '/',
      queryParams: {},
    });
  }

  setPathname = this.createSetter('pathname');

  setQueryParams = this.createSetter('queryParams', 'set-query-params');

  setQueryParam = this.action(
    'set-query-param',
    (state: RouterState, [key, value]: [key: string, value: string]) => {
      state.queryParams[key] = value;
    },
  );

  removeQueryParam = this.action('router/remove-query-param', (state: RouterState, key: string) => {
    delete state.queryParams[key];
  });

  setSearchParams = (params: URLSearchParams) => {
    const query: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      query[key] = value;
    }

    return this.setQueryParams(query);
  };
}

export const routerActions = new RouterActions();
