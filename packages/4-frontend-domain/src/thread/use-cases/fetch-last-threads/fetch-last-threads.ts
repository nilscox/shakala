import type { State, Thunk } from '../../../store';
import { Thread } from '../../../types';
import { threadDtoToEntity } from '../../domain/thread-dto-to-entity';
import { addThreads } from '../../thread.actions';

export const selectLastThreads = (state: State): Thread[] => {
  return [];
};

export const fetchLastThreads = (): Thunk => {
  return async (dispatch, getState, { threadGateway }) => {
    const threads = await threadGateway.getLast(3);

    dispatch(addThreads(threads.map(threadDtoToEntity)));
  };
};
