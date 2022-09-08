import { createAction, query, QueryState } from '@nilscox/redux-query';

import { requireAuthentication } from '../../../authentication/use-cases/require-authentication/require-authentication';
import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { State, Thunk } from '../../../store';
import { AuthorizationError } from '../../../types';
import { serializeError } from '../../../utils/serialize-error';
import {
  addCommentHistoryMessage,
  setCommentEdited,
  setCommentText,
  updateComment,
} from '../../comments.actions';
import { selectComment } from '../../comments.selectors';

type Key = {
  commentId: string;
};

const editCommentMutation = query<Key, undefined>('editComment');

export const editCommentReducer = editCommentMutation.reducer();

// actions

const actions = editCommentMutation.actions();

export const [setIsEditingComment, isSetIsEditingCommentAction] = createAction(
  'comment/set-editing',
  (commentId: string, isEditing = true) => ({ commentId, isEditing }),
);

export const setEditCommentFormText = (commentId: string, text: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    dispatch(updateComment(commentId, { editionForm: { text } }));
    await storageGateway.setDraftCommentText(DraftCommentKind.edition, commentId, text);
  };
};

export const clearEditCommentFormText = (commentId: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    dispatch(setIsEditingComment(commentId, false));
    await storageGateway.removeDraftCommentText(DraftCommentKind.edition, commentId);
  };
};

// selectors

const selectors = editCommentMutation.selectors((state: State) => state.comments.mutations.editComment);

export const selectEditCommentForm = (state: State, commentId: string) => {
  return selectComment(state, commentId).editionForm;
};

export const selectIsEditingComment = (state: State, commentId: string) => {
  return selectEditCommentForm(state, commentId) !== undefined;
};

export const selectEditCommentFormText = (state: State, commentId: string) => {
  return selectEditCommentForm(state, commentId)?.text;
};

export const selectCanSubmitEditCommentForm = (state: State, commentId: string) => {
  return selectEditCommentFormText(state, commentId) !== '';
};

export const selectIsSubmittingCommentEditionForm = (state: State, commentId: string) => {
  return selectors.selectState(state, { commentId }) === QueryState.pending;
};

export const selectEditCommentError = (state: State, commentId: string) => {
  return selectors.selectError(state, { commentId });
};

// thunk

export const editComment = (commentId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway, loggerGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const comment = selectComment(getState(), commentId);
    const key: Key = { commentId };

    // todo: type cast
    const text = selectEditCommentFormText(getState(), commentId) as string;

    try {
      dispatch(actions.setPending(key));

      await threadGateway.editComment(commentId, text);

      dispatch(addCommentHistoryMessage(commentId, comment.text, comment.date));
      dispatch(setCommentText(commentId, text));
      dispatch(setCommentEdited(commentId, dateGateway.now().toISOString()));

      await dispatch(clearEditCommentFormText(commentId));

      dispatch(actions.setSuccess(key, undefined));

      snackbarGateway.success('Votre commentaire a bien été mis à jour.');
    } catch (error) {
      loggerGateway.error(error);

      dispatch(actions.setError(key, serializeError(error)));

      if (error instanceof AuthorizationError && error.code === 'UserMustBeAuthor') {
        snackbarGateway.error("Vous devez être l'auteur du message pour pouvoir l'éditer.");
      } else {
        snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été mis à jour.");
      }
    }
  };
};
