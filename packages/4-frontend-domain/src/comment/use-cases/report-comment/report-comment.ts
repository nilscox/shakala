import { UnexpectedError } from 'shared';

import { Thunk } from '../../../store.types';
import { AuthorizationError } from '../../../types';

export const reportComment = (reason: string): Thunk => {
  return async (dispatch, getState, { threadGateway, routerGateway, snackbarGateway }) => {
    const commentId = routerGateway.getQueryParam('report');

    if (!commentId) {
      throw new UnexpectedError('reportComment: expected the report query param be set');
    }

    try {
      await threadGateway.reportComment(commentId, reason || undefined);

      routerGateway.removeQueryParam('report');
      snackbarGateway.success('Votre signalement a bien été remonté. Merci pour votre contribution !');
    } catch (error) {
      if (error instanceof AuthorizationError && error.reason === 'CommentAlreadyReported') {
        snackbarGateway.error('Vous avez déjà signalé ce commentaire.');
      } else {
        snackbarGateway.error("Une erreur s'est produite, votre signalement n'a pas pu être remonté.");
      }
    }
  };
};
