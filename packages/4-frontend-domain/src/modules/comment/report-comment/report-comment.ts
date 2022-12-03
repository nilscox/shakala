import { UnexpectedError } from 'shared';

import { CommentAlreadyReportedError } from '../../../gateways';
import { AppThunk } from '../../../store';
import { routerActions, routerSelectors } from '../../router';

// todo: loading state
export const reportComment = (reason: string): AppThunk => {
  return async (dispatch, getState, { commentGateway, snackbarGateway }) => {
    const commentId = routerSelectors.queryParam(getState(), 'report');

    if (!commentId) {
      throw new UnexpectedError('reportComment: expected the report query param to be set');
    }

    try {
      await commentGateway.reportComment(commentId, reason || undefined);

      dispatch(routerActions.removeQueryParam('report'));
      snackbarGateway.success('Votre signalement a bien été remonté. Merci pour votre contribution !');
    } catch (error) {
      if (error instanceof CommentAlreadyReportedError) {
        snackbarGateway.error('Vous avez déjà signalé ce commentaire.');
      } else {
        snackbarGateway.error("Une erreur s'est produite, votre signalement n'a pas pu être remonté.");
      }
    }
  };
};
