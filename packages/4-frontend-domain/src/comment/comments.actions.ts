import { Comment, ReactionType } from '../types';

import { commentsSlice, updateCommentEditionForm, updateCommentReplyForm } from './comments.slice';

const { actions } = commentsSlice;

export const addComments = (comments: Comment[], replies: Comment[] = []) => {
  return actions.addComments([...comments, ...replies]);
};

export const addCommentReply = (commentId: string, reply: Comment) => {
  return actions.addCommentReply({ commentId, replyId: reply.id });
};

export const setCommentText = (commentId: string, text: string) => {
  return actions.updateComment({ id: commentId, changes: { text } });
};

export const setCommentEdited = (commentId: string, edited: string) => {
  return actions.updateComment({ id: commentId, changes: { edited } });
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

export const setIsEditingComment = (commentId: string, isEditing = true) => {
  return actions.setIsEditing({ commentId, isEditing });
};

export const setCommentEditionFormText = (commentId: string, text: string) => {
  return updateCommentEditionForm(commentId, { text });
};

export const setIsSubmittingCommentEdition = (commentId: string, isSubmitting = true) => {
  return updateCommentEditionForm(commentId, { isSubmitting });
};

export const setReactionCounts = (
  commentId: string,
  reactionsCounts: Record<'upvotes' | 'downvotes', number>,
) => {
  return actions.updateComment({ id: commentId, changes: reactionsCounts });
};

export const setUserReaction = (commentId: string, userReaction: ReactionType) => {
  return actions.updateComment({ id: commentId, changes: { userReaction } });
};

export const unsetUserReaction = (commentId: string) => {
  return actions.updateComment({ id: commentId, changes: { userReaction: undefined } });
};
