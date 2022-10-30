import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { Thunk } from '../../../store.types';
import { selectThread, setCreateRootCommentText } from '../../../thread';
import { Comment } from '../../../types';
import { setIsReplying, setReplyFormText } from '../create-reply/create-reply';
import { setEditCommentFormText, setIsEditingComment } from '../edit-comment/edit-comment';

export const restoreDraftComments = (threadId: string): Thunk<Promise<void>> => {
  return async (dispatch, getState, { storageGateway }) => {
    const thread = selectThread(getState(), threadId);

    if (!thread) {
      return;
    }

    const draftRootComment = await storageGateway.getDraftCommentText(DraftCommentKind.root, thread.id);

    if (draftRootComment) {
      dispatch(setCreateRootCommentText(thread.id, draftRootComment));
    }

    // code smell: many calls to the storage
    const processComment = async (comment: Comment) => {
      const draftReply = await storageGateway.getDraftCommentText(DraftCommentKind.reply, comment.id);

      if (draftReply) {
        dispatch(setIsReplying(comment.id, true));
        dispatch(setReplyFormText(comment.id, draftReply));
      }

      const draftEdition = await storageGateway.getDraftCommentText(DraftCommentKind.edition, comment.id);

      if (draftEdition) {
        dispatch(setIsEditingComment(comment.id, true));
        dispatch(setEditCommentFormText(comment.id, draftEdition));
      }

      await Promise.all(comment.replies.map(processComment));
    };

    await Promise.all(thread.comments.map(processComment));
  };
};
