import { mockFn } from 'shared';

import { createThread, TestStore } from '../../../test';
import { Sort } from '../../../types';
import { addThread } from '../../thread.actions';

import { setThreadFilters } from './set-thread-filters';

describe('setThreadFilters', () => {
  const store = new TestStore();

  const threadId = 'threadId';

  beforeEach(() => {
    store.dispatch(addThread(createThread({ id: threadId })));
    store.threadGateway.getComments = mockFn([]);
  });

  it('refreshes the thread according to the current filters', async () => {
    await store.dispatch(setThreadFilters(threadId, { search: 'science', sort: Sort.dateDesc }));

    expect(store.threadGateway.getComments).toHaveBeenCalledWith(threadId, {
      search: 'science',
      sort: Sort.dateDesc,
    });
  });

  it('stores the filters in the query params', async () => {
    await store.dispatch(setThreadFilters(threadId, { search: 'science', sort: Sort.dateDesc }));

    expect(store.routerGateway.getQueryParam('search')).toEqual('science');
    expect(store.routerGateway.getQueryParam('sort')).toEqual(Sort.dateDesc);
  });

  it('does not store the search param when it is empty', async () => {
    await store.dispatch(setThreadFilters(threadId, { search: '', sort: Sort.dateDesc }));

    expect(store.routerGateway.getQueryParam('search')).toBe(undefined);
    expect(store.routerGateway.getQueryParam('sort')).toEqual(Sort.dateDesc);
  });

  it('removes all params when there values are the default values', async () => {
    await store.dispatch(setThreadFilters(threadId, { search: '', sort: Sort.relevance }));

    expect(store.routerGateway.getQueryParam('search')).toBe(undefined);
    expect(store.routerGateway.getQueryParam('sort')).toBe(undefined);
  });
});
