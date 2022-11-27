import { createTestStore, TestStore } from '../../../test-store';
import { createComment } from '../../comment';
import { threadActions } from '../thread.actions';
import { threadSelectors } from '../thread.selectors';
import { createThread } from '../thread.types';

import { fetchThread } from './fetch-thread';

describe('fetchThread', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('fetches the list of thread on a thread', async () => {
    const thread = createThread();

    store.threadGateway.fetchThread.resolve(thread);

    await store.dispatch(fetchThread(thread.id));

    expect(store.select(threadSelectors.byId, thread.id)).toEqual(thread);
  });

  it('updates the fetching flag when the thread are being fetched', async () => {
    store.threadGateway.fetchThread.resolve(undefined);

    await store.testLoadingState(fetchThread('threadId'), threadSelectors.isFetching);
  });

  it('does no fetch a thread when already present', async () => {
    store.dispatch(threadActions.setThread(createThread({ id: 'threadId', comments: [createComment()] })));

    await store.dispatch(fetchThread('threadId'));

    expect(store.threadGateway.fetchThread.lastCall).toBe(undefined);
    expect(store.threadGateway.fetchComments.lastCall).toBe(undefined);
  });

  it("still fetches the thread's comments when already present", async () => {
    const thread = createThread({ comments: [] });
    const comment = createComment();

    store.dispatch(threadActions.setThread(thread));
    store.threadGateway.fetchComments.resolve([comment]);

    await store.dispatch(fetchThread(thread.id));

    expect(store.threadGateway.fetchThread.lastCall).toBe(undefined);
    expect(store.select(threadSelectors.byId, thread.id)).toHaveProperty('comments', [comment]);
  });
});
