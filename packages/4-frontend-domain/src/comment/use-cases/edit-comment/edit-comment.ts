import { query, QueryState, createAction } from '@nilscox/redux-query';

import { requireAuthentication } from '../../../authentication/use-cases/require-authentication/require-authentication';
import { State, Thunk } from '../../../store';
import { selectCommentThreadId } from '../../../thread';
import { AuthorizationError } from '../../../types';
import { setCommentEdited, setCommentText, updateComment } from '../../comments.actions';
import { selectComment } from '../../comments.selectors';

type Key = {
  commentId: string;
};

const editCommentMutation = query<Key, undefined>('editComment');

export const editCommentReducer = editCommentMutation.reducer();

const actions = editCommentMutation.actions();
const selectors = editCommentMutation.selectors((state: State) => state.comments.mutations.editComment);

export const setIsEditingComment = createAction(
  'comment/set-editing',
  (commentId: string, isEditing = true) => ({ commentId, isEditing }),
);

export type SetIsEditingCommentAction = ReturnType<typeof setIsEditingComment>;

export const setEditCommentFormText = (commentId: string, text: string) => {
  return updateComment(commentId, { editionForm: { text } });
};

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

export const editComment = (commentId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const key: Key = { commentId };

    const threadId = selectCommentThreadId(getState(), commentId);
    // todo: type cast
    const text = selectEditCommentFormText(getState(), commentId) as string;

    try {
      dispatch(actions.setPending(key));

      await threadGateway.editComment(threadId, commentId, text);

      dispatch(setCommentText(commentId, text));
      dispatch(setCommentEdited(commentId, dateGateway.now().toISOString()));
      dispatch(setIsEditingComment(commentId, false));

      dispatch(actions.setSuccess(key, undefined));

      snackbarGateway.success('Votre commentaire a bien été mis à jour.');
    } catch (error) {
      // todo: serialize error
      // dispatch(actions.setError(key, error));
      console.error(error);

      if (error instanceof AuthorizationError && error.code === 'UserMustBeAuthor') {
        snackbarGateway.error("Vous devez être l'auteur du message pour pouvoir l'éditer.");
      } else {
        snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été mis à jour.");
      }
    }
  };
};
