import expect from '@nilscox/expect';
import { CommentSort, CreateCommentBody, CreateOrEditThreadBody } from '@shakala/shared';
import {
  createComment,
  createThread,
  editThread,
  getLastThreads,
  GetLastThreadsResult,
  getThread,
  getThreadComments,
  GetThreadResult,
} from '@shakala/thread';
import { beforeEach, describe, it } from 'vitest';

import { ControllerTest, createControllerTest } from '../tests/controller-test';

describe('[intg] ThreadController', () => {
  const getTest = createControllerTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  describe('GET /', () => {
    const route = '/thread';

    const result: GetLastThreadsResult = [
      {
        id: 'threadId',
        author: { id: 'authorId', nick: 'author', profileImage: '' },
        description: 'description',
        keywords: ['key', 'word'],
        date: 'date',
        edited: false,
        text: 'text',
        totalComments: 0,
      },
    ];

    it('retrieves the last 10 threads', async () => {
      test.queryBus.on(getLastThreads({ count: 10 })).return(result);

      const response = await expect(test.createAgent().get(route)).toHaveStatus(200);

      expect(await response.json()).toEqual(result);
    });

    it('fails with status 400 when the query params are invalid', async () => {
      const searchParams = new URLSearchParams({ count: 'salut' });
      await expect(test.createAgent().get(`${route}?${searchParams}`)).toHaveStatus(400);
    });
  });

  describe('GET /:threadId', () => {
    const route = '/thread/threadId';

    const result: GetThreadResult = {
      id: 'threadId',
      author: { id: 'authorId', nick: 'author', profileImage: '' },
      description: 'description',
      keywords: ['key', 'word'],
      date: 'date',
      edited: false,
      text: 'text',
      totalComments: 0,
    };

    it('retrieves a thread from its id', async () => {
      test.queryBus.on(getThread({ threadId: 'threadId' })).return(result);

      const response = await expect(test.createAgent().get(route)).toHaveStatus(200);

      expect(await response.json()).toEqual(result);
    });

    it('fails with status 404 when the thread does not exist', async () => {
      test.queryBus.on(getThread({ threadId: 'threadId' })).return(undefined);

      await expect(test.createAgent().get(route)).toHaveStatus(404);
    });
  });

  describe('GET /:threadId/comments', () => {
    const route = '/thread/threadId/comments';

    beforeEach(() => {
      test.queryBus.on(getThread({ threadId: 'threadId' })).return({ id: 'threadId' });
    });

    it("retrieves a thread's comments from its id", async () => {
      test.queryBus.on(getThreadComments({ threadId: 'threadId', sort: CommentSort.relevance })).return([]);

      const response = await expect(test.createAgent().get(route)).toHaveStatus(200);

      expect(await response.json()).toEqual([]);
    });

    it('retrieves a thread an an authenticated user', async () => {
      test.queryBus
        .on(getThreadComments({ threadId: 'threadId', userId: 'userId', sort: CommentSort.relevance }))
        .return([]);

      await expect(test.as('userId').get(route)).toHaveStatus(200);
    });

    it('retrieves a thread with custom search and sort', async () => {
      const searchParams = new URLSearchParams({
        sort: CommentSort.dateDesc,
        search: 'search',
      });

      test.queryBus
        .on(getThreadComments({ threadId: 'threadId', sort: CommentSort.dateDesc, search: 'search' }))
        .return([]);

      await expect(test.createAgent().get(`${route}?${searchParams}`)).toHaveStatus(200);
    });

    it('fails with status 400 when the query params are invalid', async () => {
      const searchParams = new URLSearchParams({
        sort: 'best',
      });

      await expect(test.createAgent().get(`${route}?${searchParams}`)).toHaveStatus(400);
    });

    it('fails with status 404 when the thread does not exist', async () => {
      test.queryBus.on(getThread({ threadId: 'threadId' })).return(undefined);

      await expect(test.createAgent().get(route)).toHaveStatus(404);
    });
  });

  describe('POST /thread', () => {
    const route = '/thread';

    const body: CreateOrEditThreadBody = {
      description: 'description',
      text: 'text',
      keywords: ['key', 'word'],
    };

    beforeEach(() => {
      test.generator.nextId = 'threadId';
    });

    it('invokes the createThread command', async () => {
      await expect(test.asUser.post(route, body)).toHaveStatus(201);

      expect(test.commandBus).toInclude(
        createThread({
          threadId: 'threadId',
          authorId: 'userId',
          ...body,
        })
      );
    });

    it("returns the created thread's id", async () => {
      const response = await expect(test.asUser.post(route, body)).toHaveStatus(201);

      expect(await response.text()).toEqual('threadId');
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().post(route, body)).toHaveStatus(401);
    });

    it('fails with status 400 when the body is invalid', async () => {
      await expect(test.asUser.post(route, {})).toHaveStatus(400);
    });
  });

  describe('PUT /thread/:threadId', () => {
    const route = '/thread/threadId';

    const body: CreateOrEditThreadBody = {
      description: 'updated description',
      text: 'updated text',
      keywords: ['updated', 'keywords'],
    };

    beforeEach(() => {
      test.generator.nextId = 'threadId';
    });

    it('invokes the editThread command', async () => {
      await expect(test.asUser.put(route, body)).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        editThread({
          threadId: 'threadId',
          authorId: 'userId',
          ...body,
        })
      );
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().put(route, body)).toHaveStatus(401);
    });

    it('fails with status 400 when the body is invalid', async () => {
      await expect(test.asUser.put(route, {})).toHaveStatus(400);
    });
  });

  describe('POST /thread/:threadId/comment', () => {
    const route = `/thread/threadId/comment`;

    const body: CreateCommentBody = {
      text: 'text',
    };

    beforeEach(() => {
      test.generator.nextId = 'commentId';
    });

    it('invokes the createComment command', async () => {
      await expect(test.asUser.post(route, body)).toHaveStatus(201);

      expect(test.commandBus).toInclude(
        createComment({
          commentId: 'commentId',
          authorId: 'userId',
          threadId: 'threadId',
          ...body,
        })
      );
    });

    it("returns the created comment's id", async () => {
      const response = await expect(test.asUser.post(route, body)).toHaveStatus(201);

      expect(await response.text()).toEqual('commentId');
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().post(route, body)).toHaveStatus(401);
    });

    it('fails with status 400 when the body is invalid', async () => {
      await expect(test.asUser.post(route, {})).toHaveStatus(400);
    });
  });
});

class Test extends ControllerTest {
  asUser = this.as('userId');

  arrange() {
    this.createUser({ id: 'userId' });
  }
}
