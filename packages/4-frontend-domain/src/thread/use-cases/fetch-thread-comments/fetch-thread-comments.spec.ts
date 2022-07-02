import { addComments } from '../../../comment/comment.actions';
import { createComment, createThread, TestStore } from '../../../test';
import { Sort } from '../../../types';
import {
  setThreadComments,
  addThread,
  setThreadCommentsSearch,
  setThreadCommentsSort,
} from '../../thread.actions';
import {
  selectLoadingComments,
  selectThreadComments,
  selectThreadCommentsSearch,
  selectThreadCommentsSort,
} from '../../thread.selectors';

import { fetchThreadComments } from './fetch-thread-comments';

describe('fetchThreadComments', () => {
  const store = new TestStore();

  const threadId = 'threadId';
  const thread = createThread({ id: threadId });
  const comments = [createComment()];

  beforeEach(() => {
    store.dispatch(addThread(thread));
    store.threadGateway.getComments.mockResolvedValue(comments);
  });

  it("fetches a thread's comments", async () => {
    const promise = store.dispatch(fetchThreadComments(threadId));

    expect(store.select(selectLoadingComments, threadId)).toBe(true);

    await promise;

    expect(store.threadGateway.getComments).toHaveBeenCalledWith(threadId, {});

    expect(store.select(selectLoadingComments, threadId)).toBe(false);
    expect(store.select(selectThreadComments, threadId)).toEqual(comments);
  });

  it('replaces the existing comments', async () => {
    const existingComments = [createComment()];

    store.dispatch(addComments(existingComments));
    store.dispatch(setThreadComments(threadId, existingComments));

    await store.dispatch(fetchThreadComments(threadId));

    expect(store.select(selectThreadComments, threadId)).toHaveLength(1);
  });

  it("fetches a thread's comments with search and sort parameters", async () => {
    store.dispatch(addThread(thread));
    store.dispatch(setThreadCommentsSearch(threadId, 'search'));
    store.dispatch(setThreadCommentsSort(threadId, Sort.dateDesc));

    await store.dispatch(fetchThreadComments(threadId));

    expect(store.threadGateway.getComments).toHaveBeenCalledWith(threadId, {
      search: 'search',
      sort: Sort.dateDesc,
    });
  });

  it('stores the search and sort parameters when they are not present', async () => {
    store.routerGateway.setQueryParam('search', 'science');
    store.routerGateway.setQueryParam('sort', Sort.dateDesc);

    store.dispatch(addThread(thread));

    await store.dispatch(fetchThreadComments(threadId));

    expect(store.select(selectThreadCommentsSearch, threadId)).toEqual('science');
    expect(store.select(selectThreadCommentsSort, threadId)).toEqual(Sort.dateDesc);
  });
});
