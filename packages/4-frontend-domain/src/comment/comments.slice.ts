import { createAction, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Comment, CommentForm } from '../types';

export const commentsEntityAdapter = createEntityAdapter<Comment>();

export const updateCommentReplyForm = createAction(
  'comments/updateReplyForm',
  (commentId: string, changes: Partial<CommentForm>) => ({
    payload: {
      commentId,
      changes,
    },
  }),
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsEntityAdapter.getInitialState(),
  reducers: {
    addComments: commentsEntityAdapter.addMany,
    addCommentReply(state, { payload }: PayloadAction<{ commentId: string; replyId: string }>) {
      const { commentId, replyId } = payload;
      const comment = state.entities[commentId];

      if (comment) {
        comment.replies.push(replyId);
      }
    },
    setIsReplying(state, { payload }: PayloadAction<{ commentId: string; isReplying: boolean }>) {
      const comment = state.entities[payload.commentId];

      if (comment) {
        if (payload.isReplying) {
          comment.replyForm = { text: '', isSubmitting: false };
        } else {
          delete comment.replyForm;
        }
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(updateCommentReplyForm, (state, { payload }) => {
      const comment = state.entities[payload.commentId];

      if (comment && comment.replyForm) {
        comment.replyForm = {
          ...comment.replyForm,
          ...payload.changes,
        };
      }
    });
  },
});
