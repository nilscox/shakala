import { createAction, query, QueryState } from '@nilscox/redux-query';

import { requireAuthentication } from '../../../authentication';
import { handleAuthorizationError } from '../../../authorization/handle-authorization-error';
import { addComment } from '../../../comment/comments.actions';
import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import type { State, Thunk } from '../../../store';
import { Comment } from '../../../types';
import { selectUserOrFail } from '../../../user';
import { serializeError } from '../../../utils/serialize-error';
import { addCreatedRootComment } from '../../lists/created-root-comments';
import { updateThread } from '../../thread.actions';
import { selectThread } from '../../thread.selectors';

type Key = {
  threadId: string;
};

const createRootCommentQuery = query<Key, undefined>('createRootComment');

export const createRootCommentQueryReducer = createRootCommentQuery.reducer();

// actions

const actions = createRootCommentQuery.actions();

export const [addRootCommentToThread, isAddRootCommentToThreadAction] = createAction(
  'thread/add-root-comment',
  (threadId: string, comment: Comment) => ({ threadId, commentId: comment.id }),
);

export const setCreateRootCommentText = (threadId: string, text: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    dispatch(updateThread(threadId, { createCommentForm: { text } }));
    await storageGateway.setDraftCommentText(DraftCommentKind.root, threadId, text);
  };
};

const clearCreateRootCommentText = (threadId: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    dispatch(setCreateRootCommentText(threadId, ''));
    await storageGateway.removeDraftCommentText(DraftCommentKind.root, threadId);
  };
};

// selectors

const selectors = createRootCommentQuery.selectors(
  (state: State) => state.threads.mutations.createRootComment,
);

export const selectCreateRootCommentFormText = (state: State, threadId: string) => {
  return selectThread(state, threadId).createCommentForm.text;
};

export const selectCanSubmitRootComment = (state: State, threadId: string) => {
  return selectCreateRootCommentFormText(state, threadId) !== '';
};

export const selectIsSubmittingRootCommentForm = (state: State, threadId: string) => {
  return selectors.selectState(state, { threadId }) === QueryState.pending;
};

export const selectCreateRootCommentError = (state: State, threadId: string) => {
  return selectors.selectError(state, { threadId });
};

// thunk

export const createRootComment = (threadId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway, loggerGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const text = selectCreateRootCommentFormText(getState(), threadId);
    const user = selectUserOrFail(getState());

    const key: Key = { threadId };

    try {
      dispatch(actions.setPending(key));

      const id = await threadGateway.createComment(threadId, text);

      const comment: Comment = {
        id,
        author: {
          id: user.id,
          nick: user.nick,
          profileImage: user.profileImage,
        },
        text,
        date: dateGateway.now().toISOString(),
        edited: false,
        history: [],
        upvotes: 0,
        downvotes: 0,
        replies: [],
      };

      dispatch(addComment(comment));
      dispatch(addCreatedRootComment(comment));
      dispatch(addRootCommentToThread(threadId, comment));

      await dispatch(clearCreateRootCommentText(threadId));

      dispatch(actions.setSuccess(key, undefined));
      snackbarGateway.success('Votre commentaire a bien été créé.');
    } catch (error) {
      dispatch(actions.setError(key, serializeError(error)));

      if (!dispatch(handleAuthorizationError(error, 'créer un commentaire'))) {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été créé.");
      }
    }
  };
};
