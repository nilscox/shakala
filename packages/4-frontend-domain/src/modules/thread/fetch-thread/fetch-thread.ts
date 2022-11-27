import { AppThunk } from '../../../store';
import { commentActions } from '../../comment';
import { threadActions } from '../thread.actions';
import { threadSelectors } from '../thread.selectors';

export const fetchThread = (threadId: string): AppThunk => {
  return async (dispatch, getState, { threadGateway }) => {
    const existingThread = threadSelectors.byId.unsafe(getState(), threadId);

    if (existingThread) {
      if (existingThread.comments.length === 0) {
        await dispatch(commentActions.fetchComments(threadId));
      }

      return;
    }

    try {
      dispatch(threadActions.setFetching(true));

      const thread = await threadGateway.fetchThread(threadId);

      if (thread) {
        dispatch(threadActions.setThread(thread));
      }
    } finally {
      dispatch(threadActions.setFetching(false));
    }
  };
};
