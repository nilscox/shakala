import { createSelector } from '@reduxjs/toolkit';

import { selectComments, selectParentComment } from '../comment/comments.selectors';
import { State } from '../store';
import { formatDate } from '../utils/format-date';

import { GetCommentsOptions } from './thread.gateway';
import { threadEntityAdapter } from './thread.slice';

const selectThreadsSlice = (state: State) => state.threads;
const selectors = threadEntityAdapter.getSelectors<State>(selectThreadsSlice);

export const { selectAll: selectThreads, selectById: selectThreadUnsafe } = selectors;

export const selectIsLoadingThread = createSelector(
  [selectThreadsSlice, (_, threadId: string) => threadId],
  ({ loadingThread }, threadId) => loadingThread[threadId],
);

export const selectLoadingThreadError = createSelector(
  [selectThreadsSlice, (_, threadId: string) => threadId],
  ({ loadingThreadError }, threadId) => loadingThreadError[threadId],
);

export const selectThread = (state: State, threadId: string) => {
  const thread = selectThreadUnsafe(state, threadId);

  if (!thread) {
    throw new Error(`selectThread: thread with id "${threadId}" is not defined`);
  }

  return thread;
};

export const selectFormattedThreadDate = createSelector(selectThread, (thread) => {
  const { date } = thread;

  return formatDate(date, "'Le' d MMMM yyyy");
});

export const selectLoadingComments = createSelector(selectThread, (thread) => {
  return thread.loadingComments;
});

export const selectLoadingCommentsError = createSelector(selectThread, (thread) => {
  return thread.loadingCommentsError;
});

export const selectThreadCommentsSearch = createSelector(selectThreadUnsafe, (thread) => {
  return thread?.commentsFilter;
});

export const selectThreadCommentsSort = createSelector(selectThreadUnsafe, (thread) => {
  return thread?.commentsSort;
});

export const selectGetCommentsOptions = createSelector(
  [selectThreadCommentsSearch, selectThreadCommentsSort],
  (filter, sort): GetCommentsOptions => {
    const options: GetCommentsOptions = {};

    if (filter) {
      options.search = filter;
    }

    if (sort) {
      options.sort = sort;
    }

    return options;
  },
);

export const selectThreadComments = (state: State, threadId: string) => {
  const commentsIds = selectThread(state, threadId).comments;

  return selectComments(state, commentsIds);
};

export const selectCommentThreadId = (state: State, commentId: string): string => {
  const parent = selectParentComment(state, commentId);

  if (parent) {
    return selectCommentThreadId(state, parent.id);
  }

  const thread = selectThreads(state).find((thread) => thread.comments.includes(commentId));

  if (!thread) {
    throw new Error(`selectCommentThreadId: cannot find thread for commentId "${commentId}"`);
  }

  return thread?.id;
};

export const selectIsSubmittingRootComment = createSelector(selectThread, (thread) => {
  return thread.createCommentForm.isSubmitting;
});

export const selectRootCommentFormText = createSelector(selectThread, (thread) => {
  return thread.createCommentForm.text;
});

export const selectCanSubmitRootComment = createSelector(selectRootCommentFormText, (text) => {
  return text !== '';
});
