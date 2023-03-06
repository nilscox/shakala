import {
  expect,
  StubDateAdapter,
  StubEventPublisher,
  StubGeneratorAdapter,
  Timestamp,
} from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { Markdown } from '../../entities/markdown.value-object';
import { Message } from '../../entities/message.entity';
import { create } from '../../factories';
import { InMemoryCommentRepository } from '../../repositories/comment/in-memory-comment.repository';

import { CommentEditedEvent, EditCommentHandler } from './edit-comment';

describe('editComment', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it("edits an existing comment's message", async () => {
    await test.act();

    const edited = test.getComment();

    const newMessage = new Message({
      id: 'messageId',
      authorId: 'authorId',
      date: test.now,
      text: new Markdown('Edited!'),
    });

    expect(edited).toHaveProperty('message', newMessage);
    expect(edited).toHaveProperty('edited', test.now);
    expect(edited).toHaveProperty('history', [test.initialMessage]);
  });

  it('publishes a CommentEditedEvent', async () => {
    await test.act();

    expect(test.publisher).toHavePublished(new CommentEditedEvent('commentId'));
  });
});

class Test {
  now = new Timestamp('2022-01-01');

  initialMessage = create.message({
    authorId: 'authorId',
  });

  comment = create.comment({
    id: 'commentId',
    authorId: 'authorId',
    messages: [this.initialMessage],
  });

  generator = new StubGeneratorAdapter();
  dateAdapter = new StubDateAdapter(this.now);
  publisher = new StubEventPublisher();
  commentRepository = new InMemoryCommentRepository([this.comment]);

  handler = new EditCommentHandler(this.generator, this.dateAdapter, this.publisher, this.commentRepository);

  constructor() {
    this.generator.nextId = 'messageId';
  }

  getComment() {
    return this.commentRepository.get('commentId');
  }

  async act() {
    await this.handler.handle({
      commentId: 'commentId',
      authorId: 'authorId',
      text: 'Edited!',
    });
  }
}
