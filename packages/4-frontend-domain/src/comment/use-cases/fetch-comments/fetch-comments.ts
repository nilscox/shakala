import { query, QueryState } from '@nilscox/redux-query';
import { getIds, isDefined, Sort } from 'shared';

import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { State, Thunk } from '../../../store.types';
import { clearCreatedRootComments } from '../../../thread/lists/created-root-comments';
import { setThreadComments } from '../../../thread/thread.actions';
import { GetCommentsOptions } from '../../../thread/thread.gateway';
import { serializeError } from '../../../utils/serialize-error';
import { addComments } from '../../comments.actions';
import { selectComments } from '../../comments.selectors';
import { commentDtoToEntity } from '../../domain/comment-dto-to-entity';
import { setReplyFormText } from '../create-reply/create-reply';
import { setEditCommentFormText } from '../edit-comment/edit-comment';

type Key = {
  threadId: string;
  search: string | undefined;
  sort: Sort | undefined;
};

const fetchCommentsQuery = query<Key, string[]>('fetchComments');

export const fetchCommentsQueryReducer = fetchCommentsQuery.reducer();

const actions = fetchCommentsQuery.actions();
const selectors = fetchCommentsQuery.selectors((state: State) => state.comments.queries.fetchComments);

export const setFetchCommentsQueryResult = (
  threadId: string,
  commentIds: string[],
  search?: string,
  sort?: Sort,
) => {
  return actions.setSuccess({ threadId, search, sort }, commentIds);
};

export const selectIsFetchingComments = (state: State, threadId: string, search?: string, sort?: Sort) => {
  return selectors.selectState(state, { threadId, search, sort }) === QueryState.pending;
};

export const selectFetchCommentsError = (state: State, threadId: string, search?: string, sort?: Sort) => {
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
  return async (dispatch, getState, { threadGateway, routerGateway, storageGateway }) => {
    const search = routerGateway.getQueryParam('search');
    const sort = routerGateway.getQueryParam('sort') as Sort;

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

      dispatch(clearCreatedRootComments());
      dispatch(addComments([...comments, ...replies]));
      dispatch(setThreadComments(threadId, comments));

      for (const comment of comments) {
        const draftReply = await storageGateway.getDraftCommentText(DraftCommentKind.reply, comment.id);

        if (draftReply) {
          dispatch(setReplyFormText(comment.id, draftReply));
        }

        const draftEdition = await storageGateway.getDraftCommentText(DraftCommentKind.edition, comment.id);

        if (draftEdition) {
          dispatch(setEditCommentFormText(comment.id, draftEdition));
        }
      }

      dispatch(actions.setSuccess(key, getIds(comments)));
    } catch (error) {
      dispatch(actions.setError(key, serializeError(error)));
      throw error;
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
