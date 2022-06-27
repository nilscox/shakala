import { Thunk } from '../../../store';
import { Sort } from '../../../types';
import { setThreadCommentsSearch, setThreadCommentsSort } from '../../thread.actions';
import { fetchThreadComments } from '../fetch-thread-comments/fetch-thread-comments';

type ThreadFilters = {
  search: string;
  sort: Sort;
};

export const setThreadFilters = (threadId: string, { search, sort }: ThreadFilters): Thunk => {
  return async (dispatch, getState, { routerGateway }) => {
    dispatch(setThreadCommentsSearch(threadId, search));
    dispatch(setThreadCommentsSort(threadId, sort));

    if (search === '') {
      routerGateway.removeQueryParam('search');
    } else {
      routerGateway.setQueryParam('search', search);
    }

    if (search === '' && sort === Sort.relevance) {
      routerGateway.removeQueryParam('sort');
    } else {
      routerGateway.setQueryParam('sort', sort);
    }

    await dispatch(fetchThreadComments(threadId));
  };
};
