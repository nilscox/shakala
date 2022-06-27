import type { Thunk } from '../../../store';
import { addThread, setLoadingThread, setLoadingThreadError } from '../../thread.actions';
import { fetchThreadComments } from '../fetch-thread-comments/fetch-thread-comments';

export const NotFound = 'NotFound';

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return JSON.stringify(error);
};

export const fetchThreadById = (threadId: string): Thunk => {
  return async (dispatch, getState, { threadGateway }) => {
    try {
      dispatch(setLoadingThread(threadId));

      const result = await threadGateway.getById(threadId);

      if (!result) {
        dispatch(setLoadingThreadError(threadId, NotFound));
        return;
      }

      const [thread] = result;

      dispatch(addThread(thread));
      await dispatch(fetchThreadComments(threadId));
    } catch (error) {
      dispatch(setLoadingThreadError(threadId, serializeError(error)));
    } finally {
      dispatch(setLoadingThread(threadId, false));
    }
  };
};
