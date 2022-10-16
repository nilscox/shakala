import { mockResolve } from 'shared';

import { createThread, TestStore } from '../../../test';
import { selectLastThreads, setLastThreads } from '../../lists/last-threads';

import { fetchLastThreads } from './fetch-last-threads';

describe('fetchLastThreads', () => {
  const store = new TestStore();

  const thread = createThread();

  beforeEach(() => {
    store.threadGateway.getLast = mockResolve([thread]);
  });

  it('fetches the last threads', async () => {
    await store.dispatch(fetchLastThreads());

    expect(store.threadGateway.getLast).toHaveBeenCalledWith(3);
    expect(store.select(selectLastThreads)).toEqual([thread]);
  });

  it('does not fetch the last threads when already fetched', async () => {
    store.dispatch(setLastThreads(['1']));

    await store.dispatch(fetchLastThreads());

    expect(store.threadGateway.getLast).not.toHaveBeenCalled();
  });
});
