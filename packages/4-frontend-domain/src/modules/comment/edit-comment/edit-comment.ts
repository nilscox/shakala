import { DraftCommentKind } from '../../../gateways/draft-messages.gateway';
import { AppThunk } from '../../../store';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationActions } from '../../authentication';
import { AuthorizationError, handleAuthorizationError } from '../../authorization';
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

      if (error instanceof AuthorizationError && error.reason === 'UserMustBeAuthor') {
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
  return async (dispatch, getState, { draftMessagesGateway }) => {
    const comment = commentSelectors.byId(getState(), commentId);
    const draft = await draftMessagesGateway.getDraftCommentText(DraftCommentKind.edition, commentId);

    setDraft(draft ?? comment.text);
  };
};

export const saveDraftEditionText = (commentId: string, text: string): AppThunk => {
  return async (dispatch, getState, { draftMessagesGateway }) => {
    await draftMessagesGateway.setDraftCommentText(DraftCommentKind.edition, commentId, text);
  };
};

export const closeCommentEditionForm = (commentId: string): AppThunk => {
  return async (dispatch, getState, { draftMessagesGateway }) => {
    dispatch(commentActions.setEditing(commentId, false));
    await draftMessagesGateway.removeDraftCommentText(DraftCommentKind.edition, commentId);
  };
};
