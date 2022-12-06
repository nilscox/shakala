import { AppThunk } from '../../../store';
import { commentActions } from '../comment.actions';
import { commentSelectors } from '../comment.selectors';

export const toggleSubscription = (commentId: string): AppThunk => {
  return async (dispatch, getState, { commentGateway, snackbarGateway, loggerGateway }) => {
    const isSubscribed = commentSelectors.isSubscribed(getState(), commentId);

    dispatch(commentActions.setSubscribed(commentId, !isSubscribed));

    try {
      if (isSubscribed) {
        await commentGateway.unsubscribe(commentId);
      } else {
        await commentGateway.subscribe(commentId);
      }
    } catch (error) {
      dispatch(commentActions.setSubscribed(commentId, isSubscribed));
      snackbarGateway.error("Une erreur s'est produite, votre action n'a pas pu être prise en compte.");
      loggerGateway.error(error);
    }
  };
};
