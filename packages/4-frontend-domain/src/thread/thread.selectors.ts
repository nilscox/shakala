import { createSelector } from '@reduxjs/toolkit';

import { selectComments } from '../comment/comment.slice';
import { State } from '../store';

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
  const commentsIds = selectThread(state, threadId)?.comments;

  if (commentsIds) {
    return selectComments(state, commentsIds);
  }
};

export const selectIsCreatingComment = createSelector(selectThread, (thread) => {
  return thread.createCommentForm.isSubmitting;
});

export const selectCreateCommentText = createSelector(selectThread, (thread) => {
  return thread.createCommentForm.text;
});
