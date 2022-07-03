import { Comment } from '../types';

import { commentsSlice, updateCommentReplyForm } from './comments.slice';

const { actions } = commentsSlice;

export const addComments = (comments: Comment[], replies: Comment[] = []) => {
  return actions.addComments([...comments, ...replies]);
};

export const addCommentReply = (commentId: string, reply: Comment) => {
  return actions.addCommentReply({ commentId, replyId: reply.id });
};

export const setIsReplying = (commentId: string, isReplying = true) => {
  return actions.setIsReplying({ commentId, isReplying });
};

export const setReplyFormText = (commentId: string, text: string) => {
  return updateCommentReplyForm(commentId, { text });
};

export const setIsSubmittingReply = (commentId: string, isSubmitting = true) => {
  return updateCommentReplyForm(commentId, { isSubmitting });
};
