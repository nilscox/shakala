import { AppThunk } from '../../../store';
import { authenticationActions } from '../../authentication';
import { routerActions } from '../../router';
import { commentSelectors } from '../comment.selectors';

export const openReportModal = (commentId: string): AppThunk<void> => {
  return (dispatch, getState, { snackbarGateway }) => {
    if (commentSelectors.isAuthor(getState(), commentId)) {
      snackbarGateway.warning("Vous ne pouvez pas signalez les commentaires dont vous êtes l'auteur.");
      return;
    }

    if (!dispatch(authenticationActions.requireAuthentication())) {
      snackbarGateway.warning('Vous devez vous connecter pour pouvoir signaler un commentaire.');
      return;
    }

    dispatch(routerActions.setQueryParam(['report', commentId]));
  };
};
