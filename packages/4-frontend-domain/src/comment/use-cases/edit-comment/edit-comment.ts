import { requireAuthentication } from '../../../authentication/use-cases/require-authentication/require-authentication';
import { Thunk } from '../../../store';
import { selectCommentThreadId } from '../../../thread';
import { AuthorizationError } from '../../../types';
import {
  setCommentEdited,
  setCommentText,
  setIsEditingComment,
  setIsSubmittingCommentEdition,
} from '../../comments.actions';

export const editComment = (commentId: string, text: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const threadId = selectCommentThreadId(getState(), commentId);

    try {
      dispatch(setIsSubmittingCommentEdition(commentId));

      await threadGateway.editComment(threadId, commentId, text);

      dispatch(setCommentText(commentId, text));
      dispatch(setCommentEdited(commentId, dateGateway.now().toISOString()));
      dispatch(setIsEditingComment(commentId, false));

      snackbarGateway.success('Votre commentaire a bien été mis à jour.');
    } catch (error) {
      if (error instanceof AuthorizationError && error.code === 'UserMustBeAuthor') {
        snackbarGateway.error("Vous devez être l'auteur du message pour pouvoir l'éditer.");
      } else {
        snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été mis à jour.");
      }
    } finally {
      dispatch(setIsSubmittingCommentEdition(commentId, false));
    }
  };
};
