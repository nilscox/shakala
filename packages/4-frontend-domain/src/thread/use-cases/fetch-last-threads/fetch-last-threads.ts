import { getIds } from 'shared';

import type { Thunk } from '../../../store';
import { threadDtoToEntity } from '../../domain/thread-dto-to-entity';
import { setLastThreads } from '../../lists/last-threads';
import { addThreads } from '../../thread.actions';

export const fetchLastThreads = (): Thunk => {
  return async (dispatch, getState, { threadGateway }) => {
    const threads = await threadGateway.getLast(3);

    dispatch(addThreads(threads.map(threadDtoToEntity)));
    dispatch(setLastThreads(getIds(threads)));
  };
};
