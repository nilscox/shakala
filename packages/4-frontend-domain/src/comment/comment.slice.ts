import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import type { State } from '../store';
import { Comment } from '../types';

const commentsEntityAdapter = createEntityAdapter<Comment>();

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsEntityAdapter.getInitialState(),
  reducers: {
    addComments: commentsEntityAdapter.addMany,
  },
});

export const { selectEntities: selectAllComments } = commentsEntityAdapter.getSelectors(
  (state: State) => state.comments,
);

export const selectComments = createSelector(
  [selectAllComments, (_, ids: string[]) => ids],
  (comments, ids) => {
    return ids.map((id) => comments[id]).filter((item): item is Comment => Boolean(item));
  },
);
