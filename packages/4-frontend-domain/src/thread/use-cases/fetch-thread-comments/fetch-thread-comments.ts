import { isDefined, isEnumValue, Sort } from 'shared';

import { addComments } from '../../../comment/comments.actions';
import { commentDtoToEntity } from '../../../comment/domain/comment-dto-to-entity';
import { Thunk } from '../../../store';
import {
  setThreadComments,
  setLoadingComments,
  setLoadingCommentsError,
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
      const commentDtos = await threadGateway.getComments(threadId, options);

      if (!commentDtos) {
        return;
      }

      const comments = commentDtos.map(commentDtoToEntity);
      const replies = commentDtos
        .flatMap(({ replies }) => replies)
        .filter(isDefined)
        .map(commentDtoToEntity);

      dispatch(addComments(comments, replies));
      dispatch(setThreadComments(threadId, comments));
    } catch (error) {
      dispatch(setLoadingCommentsError(threadId, error));
    } finally {
      dispatch(setLoadingComments(threadId, false));
    }
  };
};
