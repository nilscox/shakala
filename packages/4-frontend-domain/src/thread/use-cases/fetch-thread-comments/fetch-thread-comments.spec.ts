import { createCommentDto } from 'shared';

import { addComments } from '../../../comment/comments.actions';
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

  const replyDto = createCommentDto();
  const commentDto = createCommentDto({ replies: [replyDto] });

  beforeEach(() => {
    store.dispatch(addThread(thread));
    store.threadGateway.getComments.mockResolvedValue([commentDto]);
  });

  const execute = () => {
    return store.dispatch(fetchThreadComments(threadId));
  };

  it("fetches a thread's comments", async () => {
    const promise = execute();

    expect(store.select(selectLoadingComments, threadId)).toBe(true);
    await promise;
    expect(store.select(selectLoadingComments, threadId)).toBe(false);

    expect(store.threadGateway.getComments).toHaveBeenCalledWith(threadId, {});
  });

  it('adds the comments and replies to the thread', async () => {
    await execute();

    expect(store.select(selectThreadComments, threadId)).toEqual([
      {
        ...commentDto,
        replies: [replyDto.id],
      },
    ]);
  });

  it('replaces the existing comments', async () => {
    const existingComments = [createComment()];

    store.dispatch(addComments(existingComments));
    store.dispatch(setThreadComments(threadId, existingComments));

    await execute();

    expect(store.select(selectThreadComments, threadId)).toHaveLength(1);
  });

  it("fetches a thread's comments with search and sort parameters", async () => {
    store.dispatch(addThread(thread));
    store.dispatch(setThreadCommentsSearch(threadId, 'search'));
    store.dispatch(setThreadCommentsSort(threadId, Sort.dateDesc));

    await execute();

    expect(store.threadGateway.getComments).toHaveBeenCalledWith(threadId, {
      search: 'search',
      sort: Sort.dateDesc,
    });
  });

  it('stores the search and sort parameters when they are not present', async () => {
    store.routerGateway.setQueryParam('search', 'science');
    store.routerGateway.setQueryParam('sort', Sort.dateDesc);

    store.dispatch(addThread(thread));

    await execute();

    expect(store.select(selectThreadCommentsSearch, threadId)).toEqual('science');
    expect(store.select(selectThreadCommentsSort, threadId)).toEqual(Sort.dateDesc);
  });
});
