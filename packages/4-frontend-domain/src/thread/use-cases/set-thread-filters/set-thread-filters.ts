import { fetchComments } from '../../../comment/use-cases';
import { Thunk } from '../../../store';
import { Sort } from '../../../types';

type ThreadFilters = {
  search: string;
  sort: Sort;
};

export const setThreadFilters = (threadId: string, { search, sort }: ThreadFilters): Thunk => {
  return async (dispatch, getState, { routerGateway }) => {
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

    await dispatch(fetchComments(threadId));
  };
};
