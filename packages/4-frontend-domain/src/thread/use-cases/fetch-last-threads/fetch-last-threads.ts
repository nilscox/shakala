import { getIds } from 'shared';

import { Thunk } from '../../../store.types';
import { threadDtoToEntity } from '../../domain/thread-dto-to-entity';
import { selectLastThreads, setLastThreads } from '../../lists/last-threads';
import { addThreads } from '../../thread.actions';

export const fetchLastThreads = (): Thunk => {
  return async (dispatch, getState, { threadGateway }) => {
    if (selectLastThreads(getState()).length > 0) {
      return;
    }

    const threads = await threadGateway.getLast(3);

    dispatch(addThreads(threads.map(threadDtoToEntity)));
    dispatch(setLastThreads(getIds(threads)));
  };
};
