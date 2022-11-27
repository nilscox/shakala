import { Selectors } from '@nilscox/redux-kooltik';
import { createSelector } from 'reselect';

import { AppState } from '../../store';

import { RouterState } from './router.actions';

class RouterSelectors extends Selectors<AppState, RouterState> {
  constructor() {
    super((state) => state.router);
  }

  pathname = createSelector(this.selectState, (state) => state.pathname);

  queryParams = createSelector(this.selectState, (state) => state.queryParams);

  queryParam = createSelector(
    [this.queryParams, (params, name: string) => name],
    (queryParams, name) => queryParams[name],
  );
}

export const routerSelectors = new RouterSelectors();
