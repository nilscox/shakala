import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { State } from '../store';
import { Thread } from '../types';

import { fetchLastThreads } from './use-cases/fetch-last-threads';

const threadEntityAdapter = createEntityAdapter<Thread>();

export const threadsSlice = createSlice({
  name: 'threads',
  initialState: threadEntityAdapter.getInitialState<{ loading: boolean; error?: unknown }>({
    loading: false,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLastThreads.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchLastThreads.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    builder.addCase(fetchLastThreads.fulfilled, (state, action) => {
      state.loading = false;
      threadEntityAdapter.addMany(state, action.payload);
    });
  },
});

const selectors = threadEntityAdapter.getSelectors<State>((state) => state.threads);

export const { selectAll: selectThreads } = selectors;
