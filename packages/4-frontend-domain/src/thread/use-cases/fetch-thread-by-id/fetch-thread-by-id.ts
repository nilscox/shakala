import { query, QueryState } from '@nilscox/redux-query';

import { fetchComments } from '../../../comment/use-cases';
import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { State, Thunk } from '../../../store.types';
import { serializeError } from '../../../utils/serialize-error';
import { threadDtoToEntity } from '../../domain/thread-dto-to-entity';
import { addThread } from '../../thread.actions';
import { setCreateRootCommentText } from '../create-root-comment/create-root-comment';

export const NotFound = 'NotFound';

type Key = { threadId: string };

const getThreadQuery = query<Key, string>('getThread');

export const getThreadQueryReducer = getThreadQuery.reducer();

const actions = getThreadQuery.actions();
const selectors = getThreadQuery.selectors((state: State) => state.threads.queries.getThread);

export const selectIsLoadingThread = (state: State, threadId: string) => {
  return selectors.selectState(state, { threadId }) === QueryState.pending;
};

export const selectLoadingThreadError = (state: State, threadId: string) => {
  return selectors.selectError(state, { threadId });
};

export const fetchThreadById = (threadId: string): Thunk<Promise<void>> => {
  return async (dispatch, getState, { threadGateway, storageGateway }) => {
    const key = { threadId };

    try {
      dispatch(actions.setPending(key));

      const result = await threadGateway.getById(threadId);

      if (!result) {
        dispatch(actions.setError(key, NotFound));
        return;
      }

      const [threadDto] = result;
      const thread = threadDtoToEntity(threadDto);

      dispatch(addThread(thread));
      dispatch(actions.setSuccess(key, thread.id));

      const draftRootCommentText = await storageGateway.getDraftCommentText(DraftCommentKind.root, threadId);

      if (draftRootCommentText) {
        dispatch(setCreateRootCommentText(threadId, draftRootCommentText));
      }

      await dispatch(fetchComments(threadId));
    } catch (error) {
      dispatch(actions.setError(key, serializeError(error)));
      throw error;
    }
  };
};
