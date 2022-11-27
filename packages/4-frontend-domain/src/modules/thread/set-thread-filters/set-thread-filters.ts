import { isSort, Sort } from 'shared';

import { FetchCommentsFilters } from '../../../gateways/thread-gateway';
import { AppState, AppThunk } from '../../../store';
import { commentActions } from '../../comment';
import { routerActions, routerSelectors } from '../../router';

export const setThreadSearchFilter = (threadId: string, search: string): AppThunk<void> => {
  return async (dispatch) => {
    if (search !== '') {
      dispatch(routerActions.setQueryParam(['search', search]));
    } else {
      dispatch(routerActions.removeQueryParam('search'));
    }

    await dispatch(refreshComments(threadId));
  };
};

export const setThreadSortFilter = (threadId: string, sort: Sort): AppThunk<void> => {
  return async (dispatch) => {
    if (sort !== Sort.relevance) {
      dispatch(routerActions.setQueryParam(['sort', sort]));
    } else {
      dispatch(routerActions.removeQueryParam('sort'));
    }

    await dispatch(refreshComments(threadId));
  };
};

const refreshComments = (threadId: string): AppThunk<void> => {
  return async (dispatch, getState) => {
    await dispatch(commentActions.fetchComments(threadId, selectFilters(getState())));
  };
};

const selectFilters = (state: AppState): FetchCommentsFilters | undefined => {
  const search = routerSelectors.queryParam(state, 'search');
  const sort = routerSelectors.queryParam(state, 'sort');

  if (search || sort) {
    const filters: FetchCommentsFilters = {};

    if (search) {
      filters.search = search;
    }

    if (isSort(sort)) {
      filters.sort = sort;
    }

    return filters;
  }
};
