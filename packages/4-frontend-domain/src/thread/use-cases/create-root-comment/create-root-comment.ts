import { requireAuthentication } from '../../../authentication';
import { handleAuthorizationError } from '../../../authorization/handle-authorization-error';
import { addComment } from '../../../comment/comments.actions';
import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { State, Thunk } from '../../../store.types';
import { Comment } from '../../../types';
import { selectUser } from '../../../user';
import { createEntityAction } from '../../../utils/create-entity-action';
import { serializeError } from '../../../utils/serialize-error';
import { selectThread } from '../../thread.selectors';
import { NormalizedThread } from '../../thread.slice2';

// actions

export const addRootCommentToThread = createEntityAction(
  'thread/add-root-comment',
  (thread: NormalizedThread, comment: Comment) => ({
    ...thread,
    comments: [...thread.comments, comment.id],
  }),
);

export const setCreateRootCommentTextAction = createEntityAction(
  'thread/set-root-comment-text',
  (thread: NormalizedThread, text: string) => ({
    ...thread,
    createCommentForm: {
      ...thread.createCommentForm,
      text,
    },
  }),
);

export const setSubmittingRootComment = createEntityAction(
  'thread/set-submitting-root-comment',
  (thread: NormalizedThread, submitting: boolean) => ({
    ...thread,
    createCommentForm: {
      ...thread.createCommentForm,
      submitting,
    },
  }),
);

export const setCreateRootCommentError = createEntityAction(
  'thread/set-root-comment-error',
  (thread: NormalizedThread, error: unknown) => ({
    ...thread,
    createCommentForm: {
      ...thread.createCommentForm,
      error,
    },
  }),
);

export const setCreateRootCommentText = (threadId: string, text: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    dispatch(setCreateRootCommentTextAction(threadId, text));
    await storageGateway.setDraftCommentText(DraftCommentKind.root, threadId, text);
  };
};

const clearCreateRootCommentText = (threadId: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    dispatch(setCreateRootCommentTextAction(threadId, ''));
    await storageGateway.removeDraftCommentText(DraftCommentKind.root, threadId);
  };
};

// selectors

const selectForm = (state: State, threadId: string) => {
  return selectThread(state, threadId).createCommentForm;
};

export const selectCreateRootCommentFormText = (state: State, threadId: string) => {
  return selectForm(state, threadId).text;
};

export const selectCanSubmitRootComment = (state: State, threadId: string) => {
  return selectCreateRootCommentFormText(state, threadId) !== '';
};

export const selectIsSubmittingRootCommentForm = (state: State, threadId: string) => {
  return selectForm(state, threadId).submitting;
};

export const selectCreateRootCommentError = (state: State, threadId: string) => {
  return selectForm(state, threadId).error;
};

// thunk

export const createRootComment = (threadId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway, loggerGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const text = selectCreateRootCommentFormText(getState(), threadId);
    const user = selectUser(getState());

    try {
      dispatch(setSubmittingRootComment(threadId, true));

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
        replyForm: {
          open: false,
          text: '',
          submitting: false,
        },
        editionForm: {
          open: false,
          text: '',
          submitting: false,
        },
      };

      dispatch(addComment(comment));
      dispatch(addRootCommentToThread(threadId, comment));

      await dispatch(clearCreateRootCommentText(threadId));

      snackbarGateway.success('Votre commentaire a bien été créé.');
    } catch (error) {
      dispatch(setCreateRootCommentError(threadId, serializeError(error)));

      if (!dispatch(handleAuthorizationError(error, 'créer un commentaire'))) {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été créé.");
      }
    } finally {
      dispatch(setSubmittingRootComment(threadId, false));
    }
  };
};
