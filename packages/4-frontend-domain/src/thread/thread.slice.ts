import { createAction, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Thread } from '../types';

type ExtraPayload = {
  loadingThreads: boolean;
  loadingThreadsError?: unknown;
  loadingThread: Record<string, boolean>;
  loadingThreadError: Record<string, unknown>;
};

export const updateThreadCommentForm = createAction(
  'threads/updateCommentForm',
  (threadId: string, changes: Partial<Thread['createCommentForm']>) => ({
    payload: {
      threadId,
      changes,
    },
  }),
);

export const threadEntityAdapter = createEntityAdapter<Thread>();

const initialState = threadEntityAdapter.getInitialState<ExtraPayload>({
  loadingThreads: false,
  loadingThreadsError: undefined,
  loadingThread: {},
  loadingThreadError: {},
});

export const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setLoadingThread: (state, { payload }: PayloadAction<{ threadId: string; loading: boolean }>) => {
      state.loadingThread[payload.threadId] = payload.loading;
    },
    setLoadingThreadError: (state, { payload }: PayloadAction<{ threadId: string; error: unknown }>) => {
      state.loadingThreadError[payload.threadId] = payload.error;
    },
    addThread: threadEntityAdapter.addOne,
    addThreads: threadEntityAdapter.addMany,
    updateThread: threadEntityAdapter.updateOne,
    setThreadComments(state, { payload }: PayloadAction<{ threadId: string; commentsIds: string[] }>) {
      const thread = state.entities[payload.threadId];

      if (thread) {
        thread.comments = payload.commentsIds;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(updateThreadCommentForm, (state, { payload }) => {
      const thread = state.entities[payload.threadId];

      if (thread) {
        thread.createCommentForm = {
          ...thread.createCommentForm,
          ...payload.changes,
        };
      }
    });
  },
});
