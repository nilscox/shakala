import { get } from 'shared';

import { requireAuthentication } from '../../../authentication/use-cases/require-authentication/require-authentication';
import { handleAuthorizationError } from '../../../authorization/handle-authorization-error';
import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { State, Thunk } from '../../../store.types';
import { AuthorizationError } from '../../../types';
import { createEntityAction } from '../../../utils/create-entity-action';
import { serializeError } from '../../../utils/serialize-error';
import { setCommentEdited, setCommentText } from '../../comments.actions';
import { selectComment } from '../../comments.selectors';
import { NormalizedComment } from '../../comments.slice2';

// actions

export const setIsEditingComment = createEntityAction(
  'comment/set-editing',
  (comment: NormalizedComment, isEditing: boolean) => ({
    ...comment,
    editionForm: { ...comment.editionForm, open: isEditing, text: comment.text },
  }),
);

export const setCommentEditionText = createEntityAction(
  'comment/set-edition-text',
  (comment: NormalizedComment, text: string) => ({
    ...comment,
    editionForm: { ...comment.editionForm, text },
  }),
);

export const setIsSubmittingCommentEdition = createEntityAction(
  'comment/set-submitting-edition',
  (comment: NormalizedComment, submitting: boolean) => ({
    ...comment,
    editionForm: { ...comment.editionForm, submitting },
  }),
);

export const addCommentHistoryMessage = createEntityAction(
  'comment/add-history-message',
  (comment: NormalizedComment, text: string, date: string) => ({
    ...comment,
    history: [...comment.history, { text, date }],
  }),
);

export const setCommentEditionError = createEntityAction(
  'comment/set-edition-error',
  (comment: NormalizedComment, error: unknown) => ({
    ...comment,
    editionForm: {
      ...comment.editionForm,
      error,
    },
  }),
);

export const setEditCommentFormText = (commentId: string, text: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    dispatch(setCommentEditionText(commentId, text));
    await storageGateway.setDraftCommentText(DraftCommentKind.edition, commentId, text);
  };
};

export const clearEditCommentFormText = (commentId: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    // todo: clear text
    dispatch(setIsEditingComment(commentId, false));
    await storageGateway.removeDraftCommentText(DraftCommentKind.edition, commentId);
  };
};

// selectors

// todo: renames to commentEdition instead of editComment
export const selectEditCommentForm = (state: State, commentId: string) => {
  return selectComment(state, commentId).editionForm;
};

export const selectIsEditingComment = (state: State, commentId: string) => {
  return selectEditCommentForm(state, commentId).open;
};

export const selectEditCommentFormText = (state: State, commentId: string) => {
  return selectEditCommentForm(state, commentId).text;
};

export const selectCanSubmitEditCommentForm = (state: State, commentId: string) => {
  const { text } = selectComment(state, commentId);
  const formText = selectEditCommentFormText(state, commentId);

  return formText !== '' && formText !== text;
};

export const selectIsSubmittingCommentEditionForm = (state: State, commentId: string) => {
  return selectEditCommentForm(state, commentId).submitting;
};

export const selectEditCommentError = (state: State, commentId: string) => {
  return get(selectEditCommentForm(state, commentId).error, 'message');
};

// thunk

export const editComment = (commentId: string): Thunk<Promise<void>> => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway, loggerGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const comment = selectComment(getState(), commentId);
    const text = selectEditCommentFormText(getState(), commentId);

    try {
      dispatch(setIsSubmittingCommentEdition(commentId, true));

      await threadGateway.editComment(commentId, text);

      dispatch(addCommentHistoryMessage(commentId, comment.text, comment.date));
      dispatch(setCommentText(commentId, text));
      dispatch(setCommentEdited(commentId, dateGateway.now().toISOString()));

      await dispatch(clearEditCommentFormText(commentId));

      snackbarGateway.success('Votre commentaire a bien été mis à jour.');
    } catch (error) {
      loggerGateway.error(error);

      dispatch(setCommentEditionError(commentId, serializeError(error)));

      if (error instanceof AuthorizationError && error.reason === 'UserMustBeAuthor') {
        snackbarGateway.error("Vous devez être l'auteur du message pour pouvoir l'éditer.");
      } else if (!dispatch(handleAuthorizationError(error, 'éditer un commentaire'))) {
        snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été mis à jour.");
      }
    } finally {
      dispatch(setIsSubmittingCommentEdition(commentId, false));
    }
  };
};
