import { FetchCommentsFilters } from '../../../gateways/thread-gateway';
import { AppThunk } from '../../../store';
import { threadActions } from '../../thread';
import { commentActions } from '../comment.actions';

export const fetchComments = (threadId: string, filters?: FetchCommentsFilters): AppThunk => {
  return async (dispatch, getState, { threadGateway }) => {
    try {
      dispatch(commentActions.setFetching(true));

      const comments = await threadGateway.fetchComments(threadId, filters);

      dispatch(commentActions.addComments(comments));
      dispatch(threadActions.setComments(threadId, comments));
    } catch (error) {
      dispatch(commentActions.setFetchError(error));
      throw error;
    } finally {
      dispatch(commentActions.setFetching(false));
    }
  };
};
