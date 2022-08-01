import { query, QueryState } from '@nilscox/redux-query';
import { getIds, isDefined, isSort, Sort } from 'shared';

import { selectComments } from '../..';
import { State, Thunk } from '../../../store';
import { setThreadComments } from '../../../thread/thread.actions';
import { GetCommentsOptions } from '../../../thread/thread.gateway';
import { addComments } from '../../comments.actions';
import { commentDtoToEntity } from '../../domain/comment-dto-to-entity';

type Key = {
  threadId: string;
  search: string | undefined;
  sort: Sort | undefined;
};

const getCommentsQuery = query<Key, string[]>('getComments');

const actions = getCommentsQuery.actions();
const selectors = getCommentsQuery.selectors((state: State) => state.comments.queries.getComments);

export const { reducer: getCommentsQueryReducer } = getCommentsQuery;

export const setGetCommentsQueryResult = (
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

export const fetchComments = (threadId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, routerGateway }) => {
    const search = routerGateway.getQueryParam('search');
    let sort = routerGateway.getQueryParam('sort');

    if (!isSort(sort)) {
      routerGateway.removeQueryParam('sort');
      sort = undefined;
    }

    const key = { threadId, search, sort };

    try {
      dispatch(actions.setPending(key));

      const options = getOptions(search, sort);
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
      dispatch(addComments([...comments, ...replies]));
    } catch (error) {
      dispatch(actions.setError(key, error));
    }
  };
};

const getOptions = (search?: string, sort?: Sort) => {
  const options: GetCommentsOptions = {};

  if (search && search !== '') {
    options.search = search;
  }

  if (sort && sort !== Sort.relevance) {
    options.sort = sort;
  }

  return options;
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
