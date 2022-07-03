import { getIds } from 'shared';

import { Comment, Sort, Thread } from '../types';

import { threadsSlice, updateThreadCommentForm } from './thread.slice';

const { actions } = threadsSlice;

export const setLoadingThread = (threadId: string, loading = true) => {
  return actions.setLoadingThread({ threadId, loading });
};

export const setLoadingThreadError = (threadId: string, error: unknown) => {
  return actions.setLoadingThreadError({ threadId, error });
};

export const addThread = (thread: Thread) => {
  return actions.addThread(thread);
};

export const addThreads = (threads: Thread[]) => {
  return actions.addThreads(threads);
};

export const setLoadingComments = (threadId: string, loading = true) => {
  return actions.updateThread({ id: threadId, changes: { loadingComments: loading } });
};

export const setLoadingCommentsError = (threadId: string, error?: unknown) => {
  return actions.updateThread({ id: threadId, changes: { loadingCommentsError: error } });
};

export const setThreadCommentsSearch = (threadId: string, filter?: string) => {
  return actions.updateThread({ id: threadId, changes: { commentsFilter: filter } });
};

export const setThreadCommentsSort = (threadId: string, sort?: Sort) => {
  return actions.updateThread({ id: threadId, changes: { commentsSort: sort } });
};

export const setThreadComments = (threadId: string, comments: Comment[]) => {
  return actions.updateThread({ id: threadId, changes: { comments: getIds(comments) } });
};

export const addThreadComment = (threadId: string, comment: Comment) => {
  return actions.addThreadComment({ threadId, commentsId: comment.id });
};

export const setIsCreatingRootComment = (threadId: string, isCreatingComment = true) => {
  return updateThreadCommentForm(threadId, { isSubmitting: isCreatingComment });
};

export const setCreateRootCommentText = (threadId: string, text: string) => {
  return updateThreadCommentForm(threadId, { text });
};
