import type { Thunk } from '../../../store';
import { addThreads } from '../../thread.actions';

export const fetchLastThreads = (): Thunk => {
  return async (dispatch, getState, { threadGateway }) => {
    const threads = await threadGateway.getLast(3);

    dispatch(addThreads(threads));
  };
};
