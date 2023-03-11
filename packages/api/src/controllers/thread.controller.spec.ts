import { CreateCommentBody, CreateThreadBody } from '@shakala/shared';
import { createComment, createThread } from '@shakala/thread';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { expect } from '../tests/expect';
import { IntegrationTest } from '../tests/integration-test';

describe('[intg] ThreadController', () => {
  let test: Test;

  beforeEach(() => void (test = new Test()));
  beforeEach(() => test?.setup());
  afterEach(() => test?.cleanup());

  describe('POST /thread', () => {
    const route = '/thread';

    const body: CreateThreadBody = {
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

class Test extends IntegrationTest {
  asUser = this.as('userId');

  arrange() {
    this.user = { id: 'userId' };
  }
}
