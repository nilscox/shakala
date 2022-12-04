import { AppThunk } from '../../../store';
import { threadSelectors } from '../../thread';
import { commentActions } from '../comment.actions';
import { Comment, Reply } from '../comment.types';

export const openDraftComments = (threadId: string): AppThunk => {
  return async (dispatch, getState, { draftsGateway }) => {
    const thread = threadSelectors.byId(getState(), threadId);

    if (!thread) {
      return;
    }

    const drafts = await draftsGateway.getDrafts(threadId);

    if (!drafts) {
      return;
    }

    const processComment = (comment: Comment | Reply) => {
      if (drafts.replies[comment.id]) {
        dispatch(commentActions.setReplying(comment.id, true));
      }

      if (drafts.editions[comment.id]) {
        dispatch(commentActions.setEditing(comment.id, true));
      }

      if ('replies' in comment) {
        comment.replies.map(processComment);
      }
    };

    thread.comments.map(processComment);
  };
};
