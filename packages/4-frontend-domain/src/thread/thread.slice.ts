import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Comment, Sort, Thread } from '../types';

type ThreadSliceEntity = Thread & {
  loadingComments: boolean;
  loadingCommentsError?: unknown;
  commentsFilter?: string;
  commentsSort?: Sort;
  comments?: Comment[];
};

type ExtraPayload = {
  loadingThreads: boolean;
  loadingThreadsError?: unknown;
  loadingThread: Record<string, boolean>;
  loadingThreadError: Record<string, unknown>;
};

export const threadEntityAdapter = createEntityAdapter<ThreadSliceEntity>();

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
  },
});
