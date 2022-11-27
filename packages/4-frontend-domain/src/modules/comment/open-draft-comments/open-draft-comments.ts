import { DraftCommentKind } from '../../../gateways/draft-messages.gateway';
import { AppThunk } from '../../../store';
import { threadSelectors } from '../../thread';
import { commentActions } from '../comment.actions';
import { Comment, Reply } from '../comment.types';

export const openDraftComments = (threadId: string): AppThunk => {
  return async (dispatch, getState, { draftMessagesGateway }) => {
    const thread = threadSelectors.byId(getState(), threadId);

    if (!thread) {
      return;
    }

    // code smell: many calls to the storage
    const processComment = async (comment: Comment | Reply) => {
      const draftReply = await draftMessagesGateway.getDraftCommentText(DraftCommentKind.reply, comment.id);

      if (draftReply) {
        dispatch(commentActions.setReplying(comment.id, true));
      }

      const draftEdition = await draftMessagesGateway.getDraftCommentText(
        DraftCommentKind.edition,
        comment.id,
      );

      if (draftEdition) {
        dispatch(commentActions.setEditing(comment.id, true));
      }

      if ('replies' in comment) {
        await Promise.all(comment.replies.map(processComment));
      }
    };

    await Promise.all(thread.comments.map(processComment));
  };
};
