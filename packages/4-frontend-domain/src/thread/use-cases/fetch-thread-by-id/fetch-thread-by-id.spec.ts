import { createCommentDto, createThreadDto, getIds } from 'shared';

import { TestStore } from '../../../test';
import { selectIsLoadingThread, selectLoadingThreadError, selectThread } from '../../thread.selectors';

import { fetchThreadById, NotFound } from './fetch-thread-by-id';

describe('fetchThreadById', () => {
  const store = new TestStore();

  const threadId = 'threadId';
  const threadDto = createThreadDto({ id: threadId });
  const commentsDto = [createCommentDto()];

  it('fetches a thread from its id', async () => {
    store.threadGateway.getById.mockResolvedValue([threadDto, commentsDto]);
    store.threadGateway.getComments.mockResolvedValue(commentsDto);

    const promise = store.dispatch(fetchThreadById(threadId));

    expect(store.select(selectIsLoadingThread, threadId)).toBe(true);

    await promise;

    expect(store.threadGateway.getById).toHaveBeenCalledWith(threadId);

    expect(store.select(selectIsLoadingThread, threadId)).toBe(false);
    expect(store.select(selectLoadingThreadError, threadId)).toBeUndefined();

    expect(store.select(selectThread, threadId)).toEqual({
      ...threadDto,
      loadingComments: false,
      comments: getIds(commentsDto),
      createCommentForm: {
        isSubmitting: false,
        text: '',
      },
    });
  });

  it('stores the error message when the gateway throws', async () => {
    const error = new Error('nope');

    store.threadGateway.getById.mockRejectedValue(error);

    await store.dispatch(fetchThreadById(threadId));

    expect(store.select(selectIsLoadingThread, threadId)).toBe(false);
    expect(store.select(selectLoadingThreadError, threadId)).toHaveProperty('message', error.message);
  });

  it('sets the error to NotFound when the thread is not found', async () => {
    store.threadGateway.getById.mockResolvedValue(undefined);

    await store.dispatch(fetchThreadById(threadId));

    expect(store.select(selectIsLoadingThread, threadId)).toBe(false);
    expect(store.select(selectLoadingThreadError, threadId)).toBe(NotFound);
  });
});
