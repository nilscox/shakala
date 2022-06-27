import { isEnumValue, Sort } from 'shared';

import { Thunk } from '../../../store';
import {
  setLoadingComments,
  setLoadingCommentsError,
  setThreadComments,
  setThreadCommentsSearch,
  setThreadCommentsSort,
} from '../../thread.actions';
import {
  selectGetCommentsOptions,
  selectThreadCommentsSearch,
  selectThreadCommentsSort,
} from '../../thread.selectors';

export const fetchThreadComments = (threadId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, routerGateway }) => {
    const search = routerGateway.getQueryParam('search');
    const currentSearch = selectThreadCommentsSearch(getState(), threadId);

    if (search && search !== currentSearch) {
      dispatch(setThreadCommentsSearch(threadId, search));
    }

    const sort = routerGateway.getQueryParam('sort');
    const currentSort = selectThreadCommentsSort(getState(), threadId);

    if (isEnumValue(Sort)(sort) && sort !== currentSort) {
      dispatch(setThreadCommentsSort(threadId, sort));
    }

    try {
      dispatch(setLoadingComments(threadId));

      const options = selectGetCommentsOptions(getState(), threadId);
      const comments = await threadGateway.getComments(threadId, options);

      if (!comments) {
        return;
      }

      dispatch(setThreadComments(threadId, comments));
    } catch (error) {
      dispatch(setLoadingCommentsError(threadId, error));
    } finally {
      dispatch(setLoadingComments(threadId, false));
    }
  };
};
