import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { State } from '../store';
import { User } from '../types';

type UserSlice = User | null;

const initialState = null as UserSlice;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_, { payload }: PayloadAction<{ user: User }>) {
      return payload.user;
    },
    unsetUser() {
      return null;
    },
  },
});

export const { setUser, unsetUser } = userSlice.actions;

export const selectUser = (state: State) => state.user;
