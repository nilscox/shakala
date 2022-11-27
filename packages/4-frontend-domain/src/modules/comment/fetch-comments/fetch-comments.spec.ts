import { createTestStore, TestStore } from '../../../test-store';
import { createThread, Thread, threadActions, threadSelectors } from '../../thread';
import { commentSelectors } from '../comment.selectors';
import { createComment } from '../comment.types';

import { fetchComments } from './fetch-comments';

describe('fetchComments', () => {
  let store: TestStore;
  let thread: Thread;

  beforeEach(() => {
    store = createTestStore();

    thread = createThread();
    store.dispatch(threadActions.setThread(thread));
  });

  it('fetches the list of comments on a thread', async () => {
    const comment = createComment();

    store.threadGateway.fetchComments.resolve([comment]);

    await store.dispatch(fetchComments(thread.id));

    expect(store.select(commentSelectors.byId, comment.id)).toEqual(comment);
  });

  it('adds the comments to the thread', async () => {
    const comment = createComment();

    store.dispatch(threadActions.setThread(thread));
    store.threadGateway.fetchComments.resolve([comment]);

    await store.dispatch(fetchComments(thread.id));

    expect(store.select(threadSelectors.byId, thread.id)).toHaveProperty('comments', [comment]);
  });

  it('updates the fetching flag when the comments are being fetched', async () => {
    store.threadGateway.fetchComments.resolve([]);

    await store.testLoadingState(fetchComments(thread.id), commentSelectors.isFetching);
  });

  it('stores and re-throws the error when the call to the gateway throws', async () => {
    const error = new Error('nope.');

    store.threadGateway.fetchComments.reject(error);

    await expect.rejects(store.dispatch(fetchComments(thread.id))).with(error);

    expect(store.select(commentSelectors.isFetching)).toBe(false);
    expect(store.select(commentSelectors.fetchError)).toHaveProperty('message', error.message);
  });
});
