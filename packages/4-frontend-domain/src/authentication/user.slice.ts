import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthUser } from '../types';

type UserSlice = AuthUser | null;

const initialState = null as UserSlice;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_, { payload }: PayloadAction<{ user: AuthUser }>) {
      return payload.user;
    },
    unsetUser() {
      return null;
    },
  },
});

export const { setUser, unsetUser } = userSlice.actions;