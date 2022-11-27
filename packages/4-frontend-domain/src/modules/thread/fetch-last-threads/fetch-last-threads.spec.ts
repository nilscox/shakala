import { array } from 'shared';

import { createTestStore, TestStore } from '../../../test-store';
import { threadActions } from '../thread.actions';
import { threadSelectors } from '../thread.selectors';
import { createThread } from '../thread.types';

import { fetchLastThreads } from './fetch-last-threads';

describe('fetchLastThreads', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
    store.threadGateway.fetchLast.resolve([]);
  });

  it('fetches the list of threads recently created', async () => {
    const threads = array(2, () => createThread());
    store.threadGateway.fetchLast.resolve(threads);

    await store.dispatch(fetchLastThreads(3));

    expect(store.select(threadSelectors.lastThreads)).toEqual(threads);
  });

  it('does not fetch the last threads when already present', async () => {
    const thread = createThread();

    store.dispatch(threadActions.setThread(thread));
    store.dispatch(threadActions.setLastThreads([thread.id]));

    await store.dispatch(fetchLastThreads(3));

    expect(store.threadGateway.fetchLast.lastCall).toBe(undefined);
  });
});
