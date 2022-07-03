import { createSelector } from '@reduxjs/toolkit';
import { isDefined } from 'shared';

import { Selector, State } from '../store';
import { Comment } from '../types';

import { commentsEntityAdapter } from './comments.slice';

const selectCommentsSlice = (state: State) => state.comments;
const selectors = commentsEntityAdapter.getSelectors(selectCommentsSlice);
const {
  selectById: selectCommentUnsafe,
  selectEntities: selectCommentsMap,
  selectAll: selectAllComments,
} = selectors;

export const selectComments = createSelector(
  [selectCommentsMap, (_, ids: string[]) => ids],
  (comments, ids) => {
    return ids.map((id) => comments[id]).filter(isDefined);
  },
);

export const selectComment: Selector<[string], Comment> = (state, id) => {
  const comment = selectCommentUnsafe(state, id);

  if (!comment) {
    throw new Error(`selectComment: comment with id "${id}" is not defined`);
  }

  return comment;
};

export const selectCommentReplies = createSelector(
  [selectCommentsMap, selectComment],
  (comments, comment) => {
    return comment.replies.map((replyId) => comments[replyId]).filter(isDefined);
  },
);

export const selectReplyForm = createSelector(selectComment, (comment) => {
  return comment.replyForm;
});

export const selectIsReplying = createSelector(selectReplyForm, (form) => {
  return form !== undefined;
});

export const selectIsSubmittingReply = createSelector(selectReplyForm, (form) => {
  return form?.isSubmitting;
});

export const selectReplyFormText = createSelector(selectReplyForm, (form) => {
  return form?.text;
});

export const selectCanSubmitReply = createSelector(selectReplyFormText, (text) => {
  return text !== '';
});

export const selectParentComment = createSelector(
  [selectAllComments, (_, replyId: string) => replyId],
  (comments, replyId: string) => {
    return comments.find(({ replies }) => replies.includes(replyId));
  },
);

export const selectIsReply = createSelector(
  [selectAllComments, (_, commentId: string) => commentId],
  (comments, commentId) => {
    return comments.some(({ replies }) => replies.includes(commentId));
  },
);

export const selectCanReply = createSelector(selectIsReply, (isReply) => {
  return !isReply;
});

export const selectIsEditingComment = createSelector(selectComment, (comment) => {
  return comment.isEditing;
});
