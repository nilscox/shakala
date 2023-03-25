import expect from '@nilscox/expect';
import { StubDateAdapter, StubEventPublisher, StubGeneratorAdapter, Timestamp } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { Markdown } from '../../entities/markdown.value-object';
import { InMemoryCommentRepository } from '../../repositories/comment/in-memory-comment.repository';

import { CommentCreatedEvent, CreateCommentHandler, ReplyCreatedEvent } from './create-comment';

describe('createComment', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a new root comment', async () => {
    await test.act();

    const created = test.getComment();

    expect.assert(created);
    expect(created).toHaveProperty('id', 'commentId');
    expect(created).toHaveProperty('threadId', 'threadId');
    expect(created).toHaveProperty('authorId', 'authorId');
    expect(created).toHaveProperty('parentId', undefined);
    expect(created).toHaveProperty('message.id', 'messageId');
    expect(created).toHaveProperty('message.text', new Markdown('Hello!'));
    expect(created).toHaveProperty('message.date', test.now);
    expect(created).toHaveProperty('history', []);
    expect(created).toHaveProperty('edited', false);
    expect(created).toHaveProperty('creationDate', test.now);
  });

  it('publishes a CommentCreatedEvent', async () => {
    await test.act();

    expect(test.publisher).toHavePublished(new CommentCreatedEvent('commentId'));
  });

  it('creates a new reply', async () => {
    await test.act('parentId');

    const created = test.getComment();

    expect.assert(created);
    expect(created).toHaveProperty('parentId', 'parentId');
  });

  it('publishes a ReplyCreatedEvent', async () => {
    await test.act('parentId');

    expect(test.publisher).toHavePublished(new ReplyCreatedEvent('commentId'));
  });
});

class Test {
  now = new Timestamp('2022-01-01');

  generator = new StubGeneratorAdapter();
  publisher = new StubEventPublisher();
  dateAdapter = new StubDateAdapter(this.now);
  commentRepository = new InMemoryCommentRepository();

  handler = new CreateCommentHandler(
    this.publisher,
    this.generator,
    this.dateAdapter,
    this.commentRepository
  );

  constructor() {
    this.generator.nextIds = ['messageId'];
  }

  getComment() {
    return this.commentRepository.get('commentId');
  }

  async act(parentId?: string) {
    await this.handler.handle({
      commentId: 'commentId',
      authorId: 'authorId',
      threadId: 'threadId',
      parentId,
      text: 'Hello!',
    });
  }
}
