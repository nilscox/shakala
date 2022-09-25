import { requireAuthentication } from '../../../authentication';
import { Thunk } from '../../../store.types';
import { selectIsAuthUserAuthor } from '../../comments.selectors';

export const openReportModal = (commentId: string): Thunk => {
  return (dispatch, getState, { routerGateway, snackbarGateway }) => {
    if (selectIsAuthUserAuthor(getState(), commentId)) {
      snackbarGateway.warning("Vous ne pouvez pas signalez les commentaires dont vous êtes l'auteur.");
      return;
    }

    // todo: set the report query param in the next url
    if (!dispatch(requireAuthentication())) {
      snackbarGateway.warning('Vous devez vous connecter pour pouvoir signaler un commentaire.');
      return;
    }

    routerGateway.setQueryParam('report', commentId);
  };
};
