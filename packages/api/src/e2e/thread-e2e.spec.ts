import { StubLoggerAdapter, TOKENS } from '@shakala/common';
import {
  CreateCommentBody,
  CreateThreadBody,
  EditCommentBody,
  ReportCommentBody,
  SetReactionBody,
} from '@shakala/shared';
import { createComment, createThread } from '@shakala/thread';
import { ReactionType } from '@shakala/thread/src/entities/reaction.entity';
import { createUser } from '@shakala/user';
import { beforeEach, describe, it } from 'vitest';

import { container } from '../container';
import { expect } from '../tests/expect';
import { FetchAgent } from '../tests/fetch-agent';
import { TestServer } from '../tests/test-server';
import { API_TOKENS } from '../tokens';

describe('[e2e] thread', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.server.init();
  });

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
});

class Test {
  agent: FetchAgent;

  constructor() {
    container.bind(TOKENS.logger).toInstance(StubLoggerAdapter).inSingletonScope();
    container.bind(API_TOKENS.testServer).toInstance(TestServer).inContainerScope();
    this.agent = this.server.as('userId');
  }

  get server() {
    return container.get(API_TOKENS.testServer);
  }

  get commandBus() {
    return container.get(TOKENS.commandBus);
  }

  async createUser() {
    await this.commandBus.execute(
      createUser({
        userId: 'userId',
        nick: 'nick',
        email: '',
        password: '',
      })
    );
  }

  async createThread() {
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

  async createComment() {
    await this.commandBus.execute(
      createComment({
        commentId: 'commentId',
        threadId: 'threadId',
        authorId: 'authorId',
        text: '',
      })
    );
  }
}
