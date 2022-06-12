import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThreadDto } from 'shared';

import type { ThunkConfig } from '../../store';

export const fetchLastThreads = createAsyncThunk<ThreadDto[], void, ThunkConfig>(
  'threads/get-last',
  async (_, { extra }) => {
    return extra.threadGateway.getLast(3);
  },
);
