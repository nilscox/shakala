import expect from '@nilscox/expect';
import { CommentSort, createThreadDto } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { StubHttpAdapter } from '../../http/stub-http.adapter';

import { ApiThreadAdapter } from './api-thread.adapter';
import { GetThreadCommentsOptions } from './thread.port';

describe('ApiThreadAdapter', () => {
  let http: StubHttpAdapter;
  let adapter: ApiThreadAdapter;

  beforeEach(() => {
    http = new StubHttpAdapter();
    adapter = new ApiThreadAdapter(http);
  });

  const thread = createThreadDto({ id: 'threadId' });

  describe('getLastThreads', () => {
    it('fetches the last threads', async () => {
      http.response = { body: [thread] };

      await expect(adapter.getLastThreads(3)).toResolve([thread]);
      expect(http.requests).toInclude({ method: 'GET', url: '/thread', search: { count: 3 } });
    });
  });

  describe('getThread', () => {
    beforeEach(() => {
      http.response = { body: thread };
    });

    it('fetches a thread from its id', async () => {
      await expect(adapter.getThread('threadId')).toResolve(thread);
      expect(http.requests).toInclude({ method: 'GET', url: '/thread/threadId' });
    });
  });

  describe('getThreadComments', () => {
    beforeEach(() => {
      http.response = { body: [] };
    });

    it("fetches a thread's comments from its id", async () => {
      await expect(adapter.getThreadComments('threadId')).toResolve([]);
      expect(http.requests).toInclude({ method: 'GET', url: '/thread/threadId/comments' });
    });

    it("fetches a thread's comments with sort and search options", async () => {
      const options: GetThreadCommentsOptions = {
        sort: CommentSort.dateAsc,
        search: 'search query',
      };

      await adapter.getThreadComments('threadId', options);

      expect(http.requests).toInclude({
        method: 'GET',
        url: '/thread/threadId/comments',
        search: options,
      });
    });
  });
});
