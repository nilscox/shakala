import { Sort } from 'shared';

import { StubThreadGateway } from '../../../stubs/stub-thread-gateway';
import { createTestStore, TestStore } from '../../../test-store';
import { createComment } from '../../comment';
import { routerActions, routerSelectors } from '../../router';
import { threadActions } from '../thread.actions';
import { threadSelectors } from '../thread.selectors';
import { createThread } from '../thread.types';

import { setThreadSearchFilter, setThreadSortFilter } from './set-thread-filters';

describe('setThreadFilters', () => {
  let store: TestStore;
  let fetchComments: StubThreadGateway['fetchComments'];

  beforeEach(() => {
    store = createTestStore();

    store.dispatch(threadActions.setThread(createThread({ id: 'threadId' })));

    fetchComments = store.threadGateway.fetchComments;
    fetchComments.resolve([]);
  });

  it("refreshes the thread's comments according to the current search filter", async () => {
    await store.dispatch(setThreadSearchFilter('threadId', 'science'));

    expect(fetchComments.lastCall).toEqual(['threadId', { search: 'science' }]);
  });

  it("refreshes the thread's comments according to the current sort filter", async () => {
    await store.dispatch(setThreadSortFilter('threadId', Sort.dateAsc));

    expect(fetchComments.lastCall).toEqual(['threadId', { sort: Sort.dateAsc }]);
    expect(fetchComments.lastCall).not.toHaveProperty('1.search');
  });

  it("combines the thead's filters", async () => {
    await store.dispatch(setThreadSearchFilter('threadId', 'science'));
    await store.dispatch(setThreadSortFilter('threadId', Sort.dateAsc));

    expect(fetchComments.lastCall).toEqual(['threadId', { search: 'science', sort: Sort.dateAsc }]);
  });

  it('stores the filters in the query params', async () => {
    await store.dispatch(setThreadSearchFilter('threadId', 'science'));
    await store.dispatch(setThreadSortFilter('threadId', Sort.dateAsc));

    expect(store.select(routerSelectors.queryParams)).toEqual({
      search: 'science',
      sort: Sort.dateAsc,
    });
  });

  it('clears the search filter when it is empty', async () => {
    await store.dispatch(setThreadSearchFilter('threadId', 'science'));
    await store.dispatch(setThreadSearchFilter('threadId', ''));

    expect(fetchComments.lastCall).toEqual(['threadId', undefined]);
    expect(store.select(routerSelectors.queryParams)).toEqual({});
  });

  it('clears the sort filter when it is Sort.relevance', async () => {
    await store.dispatch(setThreadSortFilter('threadId', Sort.dateAsc));
    await store.dispatch(setThreadSortFilter('threadId', Sort.relevance));

    expect(fetchComments.lastCall).toEqual(['threadId', undefined]);
    expect(store.select(routerSelectors.queryParams)).toEqual({});
  });

  it('discards the sort filter when its value is not a sort enum value', async () => {
    await store.dispatch(routerActions.setQueryParam(['sort', 'boubou']));
    await store.dispatch(setThreadSearchFilter('threadId', 'science'));

    expect(fetchComments.lastCall).toEqual(['threadId', { search: 'science' }]);
  });

  it('replaces the existing comments on the thread', async () => {
    const existingComment = createComment();
    const thread = createThread({ comments: [existingComment] });

    const comment = createComment();

    store.dispatch(threadActions.setThread(thread));
    store.dispatch(threadActions.addComments('threadId', [existingComment]));
    store.threadGateway.fetchComments.resolve([comment]);

    await store.dispatch(setThreadSortFilter('threadId', Sort.relevance));

    expect(store.select(threadSelectors.byId, 'threadId')).toHaveProperty('comments', [comment]);
  });
});
