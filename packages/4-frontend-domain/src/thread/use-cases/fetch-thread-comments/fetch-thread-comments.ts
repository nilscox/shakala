import { query, QueryState } from '@nilscox/redux-query';
import { getIds, isDefined, Sort } from 'shared';

import { selectComments } from '../../../comment';
import { addComments } from '../../../comment/comments.actions';
import { commentDtoToEntity } from '../../../comment/domain/comment-dto-to-entity';
import { State, Thunk } from '../../../store';
import { setThreadComments } from '../../thread.actions';

type Key = {
  threadId: string;
  search: string | undefined;
  sort: Sort | undefined;
};

const getThreadCommentsQuery = query<Key, string[]>('getThreadComments');

const actions = getThreadCommentsQuery.actions();
const selectors = getThreadCommentsQuery.selectors((state: State) => state.threads.queries.getThreadComments);

export const { reducer: getThreadCommentsQueryReducer } = getThreadCommentsQuery;

export const setGetThreadCommentsQueryResult = (
  threadId: string,
  commentIds: string[],
  search?: string,
  sort?: Sort,
) => {
  return actions.setSuccess({ threadId, search, sort }, commentIds);
};

export const selectLoadingComments = (state: State, threadId: string, search?: string, sort?: Sort) => {
  return selectors.selectState(state, { threadId, search, sort }) === QueryState.pending;
};

export const selectLoadingCommentsError = (state: State, threadId: string, search?: string, sort?: Sort) => {
  return selectors.selectError(state, { threadId, search, sort });
};

export const selectThreadComments = (state: State, threadId: string, search?: string, sort?: Sort) => {
  const commentsIds = selectors.selectResult(state, { threadId, search, sort });

  if (!commentsIds) {
    return;
  }

  return selectComments(state, commentsIds);
};

export const fetchThreadComments = (threadId: string, search?: string, sort?: Sort): Thunk => {
  return async (dispatch, getState, { threadGateway }) => {
    const key = { threadId, search, sort };

    try {
      dispatch(actions.setPending(key));

      const options = { search, sort };
      const commentDtos = await threadGateway.getComments(threadId, options);

      if (!commentDtos) {
        return;
      }

      const comments = commentDtos.map(commentDtoToEntity);
      const replies = commentDtos
        .flatMap(({ replies }) => replies)
        .filter(isDefined)
        .map(commentDtoToEntity);

      dispatch(actions.setSuccess(key, getIds(comments)));
      dispatch(setThreadComments(threadId, comments));
      dispatch(addComments(comments, replies));
    } catch (error) {
      dispatch(actions.setError(key, error));
    }
  };
};

// todo: use a fallback reducer for the query result
export const addCommentToThreadQuery = (
  threadId: string,
  commentId: string,
  search?: string,
  sort?: Sort,
): Thunk => {
  return (dispatch, getState) => {
    const key = { threadId, search, sort };
    const commentIds = selectors.selectResult(getState(), key) ?? [];

    dispatch(actions.setSuccess(key, [...commentIds, commentId]));
  };
};
