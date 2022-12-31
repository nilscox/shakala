import { UserMustBeAuthorError } from '@shakala/shared';

import { AppThunk } from '../../../store';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationActions } from '../../authentication';
import { handleAuthorizationError } from '../../authorization';
import { commentActions } from '../comment.actions';
import { commentSelectors } from '../comment.selectors';

export const editComment = (commentId: string, text: string): AppThunk<Promise<boolean>> => {
  return async (dispatch, getState, { commentGateway, dateGateway, snackbarGateway, loggerGateway }) => {
    const user = dispatch(authenticationActions.requireAuthentication());

    if (!user) {
      return false;
    }

    text = text.trim();

    try {
      await commentGateway.editComment(commentId, text);

      dispatch(commentActions.setText(commentId, { text, now: dateGateway.nowAsString() }));
      await dispatch(closeCommentEditionForm(commentId));

      snackbarGateway.success('Votre commentaire a bien été mis à jour.');

      return true;
    } catch (error) {
      if (error instanceof ValidationErrors) {
        throw error;
      }

      if (error instanceof UserMustBeAuthorError) {
        snackbarGateway.error("Vous devez être l'auteur du message pour pouvoir l'éditer.");
        return false;
      }

      if (!dispatch(handleAuthorizationError(error, 'éditer un commentaire'))) {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été mis à jour.");
      }

      return false;
    }
  };
};

export const getInitialEditionText = (commentId: string, setDraft: (text: string) => void): AppThunk => {
  return async (dispatch, getState, { draftsGateway }) => {
    const threadId = commentSelectors.threadId(getState(), commentId);
    const comment = commentSelectors.byId(getState(), commentId);
    const draft = await draftsGateway.getDraft('edition', threadId as string, commentId);

    setDraft(draft ?? comment.text);
  };
};

export const saveDraftEditionText = (commentId: string, text: string): AppThunk => {
  return async (dispatch, getState, { draftsGateway }) => {
    const threadId = commentSelectors.threadId(getState(), commentId);
    await draftsGateway.setDraft('edition', threadId as string, commentId, text);
  };
};

export const closeCommentEditionForm = (commentId: string): AppThunk => {
  return async (dispatch, getState, { draftsGateway }) => {
    dispatch(commentActions.setEditing(commentId, false));

    const threadId = commentSelectors.threadId(getState(), commentId);
    await draftsGateway.clearDraft('edition', threadId as string, commentId);
  };
};
