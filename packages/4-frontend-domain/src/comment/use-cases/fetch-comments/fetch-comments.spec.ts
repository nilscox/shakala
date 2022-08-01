import { createCommentDto } from 'shared';

import { createComment, createThread, TestStore } from '../../../test';
import { addThread, setThreadComments } from '../../../thread/thread.actions';
import { Sort } from '../../../types';
import { addComments } from '../../comments.actions';

import { fetchComments, selectLoadingComments, selectThreadComments } from './fetch-comments';

describe('fetchComments', () => {
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
    return store.dispatch(fetchComments(threadId));
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
        replies: [expect.objectContaining({ id: replyDto.id })],
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

    store.routerGateway.setQueryParam('search', 'search');
    store.routerGateway.setQueryParam('sort', Sort.dateDesc);

    await execute();

    expect(store.threadGateway.getComments).toHaveBeenCalledWith(threadId, {
      search: 'search',
      sort: Sort.dateDesc,
    });
  });
});
