import { addComments } from '../../../comment';
import { commentDtoToEntity } from '../../../comment/domain/comment-dto-to-entity';
import { Thunk } from '../../../store.types';
import { threadDtoToEntity } from '../../domain/thread-dto-to-entity';
import { addThread, setThreadComments } from '../../thread.actions';

export const NotFound = 'NotFound';

export const fetchThreadById = (threadId: string): Thunk<Promise<void>> => {
  return async (dispatch, getState, { threadGateway }) => {
    try {
      // dispatch(actions.setPending(key));

      const result = await threadGateway.getById(threadId);

      if (!result) {
        // dispatch(actions.setError(key, NotFound));
        return;
      }

      const [threadDto, commentDtos] = result;
      const thread = threadDtoToEntity(threadDto);

      dispatch(addThread(thread));
      // dispatch(actions.setSuccess(key, thread.id));

      await dispatch(addComments(commentDtos.map(commentDtoToEntity)));
      await dispatch(setThreadComments(threadId, commentDtos.map(commentDtoToEntity)));
    } catch (error) {
      console.log(error);
      // dispatch(actions.setError(key, serializeError(error)));
      throw error;
    }
  };
};
