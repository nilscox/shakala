import { createCommentDto, createThreadDto, mockReject, mockResolve } from 'shared';

import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { TestStore } from '../../../test';
import { Comment } from '../../../types';
import { selectThread } from '../../thread.selectors';
import { selectCreateRootCommentFormText } from '../create-root-comment/create-root-comment';

import {
  fetchThreadById,
  NotFound,
  selectIsLoadingThread,
  selectLoadingThreadError,
} from './fetch-thread-by-id';

describe('fetchThreadById', () => {
  const store = new TestStore();

  const threadId = 'threadId';
  const threadDto = createThreadDto({ id: threadId });
  const commentsDto = [createCommentDto()];

  beforeEach(() => {
    store.threadGateway.getById = mockResolve([threadDto, commentsDto]);
    store.threadGateway.getComments = mockResolve(commentsDto);
  });

  it('fetches a thread from its id', async () => {
    const promise = store.dispatch(fetchThreadById(threadId));

    expect(store.select(selectIsLoadingThread, threadId)).toBe(true);

    await promise;

    expect(store.threadGateway.getById).toHaveBeenCalledWith(threadId);

    expect(store.select(selectIsLoadingThread, threadId)).toBe(false);
    expect(store.select(selectLoadingThreadError, threadId)).toBe(undefined);

    expect(store.select(selectThread, threadId)).toEqual({
      ...threadDto,
      comments: [expect.objectWith({ id: commentsDto[0].id } as Comment)],
      createCommentForm: {
        text: '',
      },
    });
  });

  it('restores the draft root comment text', async () => {
    store.storageGateway.set(DraftCommentKind.root, threadId, 'draft');

    await store.dispatch(fetchThreadById(threadId));

    expect(store.select(selectCreateRootCommentFormText, threadId)).toEqual('draft');
  });

  it('stores the error and re-throws it when the gateway throws', async () => {
    const error = new Error('nope');

    store.threadGateway.getById = mockReject(error);

    await expect.rejects(store.dispatch(fetchThreadById(threadId))).with(error);

    expect(store.select(selectIsLoadingThread, threadId)).toBe(false);
    expect(store.select(selectLoadingThreadError, threadId)).toHaveProperty('message', error.message);
  });

  it('sets the error to NotFound when the thread is not found', async () => {
    store.threadGateway.getById = mockResolve(undefined);

    await store.dispatch(fetchThreadById(threadId));

    expect(store.select(selectIsLoadingThread, threadId)).toBe(false);
    expect(store.select(selectLoadingThreadError, threadId)).toBe(NotFound);
  });
});
