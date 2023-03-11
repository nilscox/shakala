import { listUserNotifications, NotificationType } from '@shakala/notification';
import {
  CreateCommentBody,
  CreateThreadBody,
  EditCommentBody,
  ReactionType,
  ReportCommentBody,
  SetReactionBody,
  waitFor,
} from '@shakala/shared';
import { createComment, createThread } from '@shakala/thread';
import { createUser, validateUserEmail } from '@shakala/user';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { E2ETest } from '../tests/e2e-test';
import { expect } from '../tests/expect';

describe('[e2e] thread', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.setup();
  });

  afterEach(() => test?.cleanup());

  it('As a user, I can create a thread post a comment and edit it', async () => {
    const agent = test.agent;

    await test.createUser();

    const threadId = await createThread();
    const commentId = await createComment(threadId);
    await editComment(commentId);

    async function createThread() {
      const body: CreateThreadBody = {
        description: 'description',
        text: 'text',
        keywords: [],
      };

      const response = await expect(agent.post('/thread', body)).toHaveStatus(201);

      return response.text();
    }

    async function createComment(threadId: string) {
      const body: CreateCommentBody = {
        text: 'text',
      };

      const response = await expect(agent.post(`/thread/${threadId}/comment`, body)).toHaveStatus(201);

      return response.text();
    }

    async function editComment(commentId: string) {
      const body: EditCommentBody = {
        text: 'edit',
      };

      await expect(agent.put(`/comment/${commentId}`, body)).toHaveStatus(204);
    }
  });

  it('As a user, I can set reactions, reply and report comments', async () => {
    const agent = test.agent;

    await test.createUser();
    await test.createThread();
    await test.createComment();

    await setReaction('commentId', ReactionType.upvote);
    await createReply('threadId', 'commentId');
    await report('commentId');

    async function setReaction(commentId: string, type: ReactionType) {
      const body: SetReactionBody = {
        type,
      };

      await expect(agent.post(`/comment/${commentId}/reaction`, body)).toHaveStatus(204);
    }

    async function createReply(threadId: string, parentId: string) {
      const body: CreateCommentBody = {
        parentId,
        text: 'reply',
      };

      await expect(agent.post(`/thread/${threadId}/comment`, body)).toHaveStatus(201);
    }

    async function report(commentId: string) {
      const body: ReportCommentBody = {
        reason: 'reason',
      };

      await expect(agent.post(`/comment/${commentId}/report`, body)).toHaveStatus(204);
    }
  });

  it('As a user, I can subscribe to a comment', async () => {
    const agent = test.agent;

    await test.createUser();
    await test.createThread();
    await test.createComment();

    await subscribe('commentId');
    await unsubscribe('commentId');

    async function subscribe(commentId: string) {
      await expect(agent.post(`/comment/${commentId}/subscribe`)).toHaveStatus(204);
    }

    async function unsubscribe(commentId: string) {
      await expect(agent.post(`/comment/${commentId}/unsubscribe`)).toHaveStatus(204);
    }
  });

  it('As a user, I receive a notification when I get a reply', async () => {
    await test.createUser();
    await test.createThread();
    await test.createComment('userId');
    await new Promise((r) => setTimeout(r, 500));
    await test.createReply();

    await waitFor(async () => {
      const notifications = await test.getNotifications();

      expect(notifications).toHaveLength(2);
      expect(notifications).toHaveProperty('1.type', NotificationType.replyCreated);
    });
  });
});

class Test extends E2ETest {
  agent = this.server.as('userId');

  async createUser() {
    await this.commandBus.execute(
      createUser({
        userId: 'userId',
        nick: 'nick',
        email: 'user@email.tld',
        password: '',
      })
    );

    await this.commandBus.execute(
      validateUserEmail({
        userId: 'userId',
      })
    );
  }

  async createThread() {
    await this.commandBus.execute(
      createUser({
        userId: 'authorId',
        nick: 'author',
        email: 'author@domain.tld',
        password: '',
      })
    );

    await this.commandBus.execute(
      createThread({
        threadId: 'threadId',
        authorId: 'authorId',
        description: '',
        text: '',
        keywords: [],
      })
    );
  }

  async createComment(authorId = 'authorId') {
    await this.commandBus.execute(
      createComment({
        commentId: 'commentId',
        threadId: 'threadId',
        authorId,
        text: '',
      })
    );
  }

  async createReply() {
    await this.commandBus.execute(
      createComment({
        commentId: 'replyId',
        threadId: 'threadId',
        parentId: 'commentId',
        authorId: 'authorId',
        text: '',
      })
    );
  }

  async getNotifications() {
    return this.queryBus.execute(listUserNotifications({ userId: 'userId' }));
  }
}
