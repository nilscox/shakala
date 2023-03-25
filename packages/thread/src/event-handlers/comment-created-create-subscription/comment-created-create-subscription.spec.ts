import expect from '@nilscox/expect';
import { StubCommandBus } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { CommentCreatedEvent } from '../../commands/create-comment/create-comment';
import { setCommentSubscription } from '../../commands/set-comment-subscription/set-comment-subscription';
import { create } from '../../factories';
import { InMemoryCommentRepository } from '../../repositories/comment/in-memory-comment.repository';

import { CreateCommentCreatedSubscriptionHandler } from './comment-created-create-subscription';

describe('CreateCommentCreatedSubscriptionHandler', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a subscription when a comment is created', async () => {
    await test.act();

    expect(test.commandBus).toInclude(
      setCommentSubscription({
        commentId: 'commentId',
        userId: 'userId',
        subscribed: true,
      })
    );
  });
});

class Test {
  readonly comment = create.comment({
    id: 'commentId',
    authorId: 'userId',
  });

  readonly commandBus = new StubCommandBus();
  readonly commentRepository = new InMemoryCommentRepository([this.comment]);

  private handler = new CreateCommentCreatedSubscriptionHandler(this.commandBus, this.commentRepository);

  async act() {
    await this.handler.handle(new CommentCreatedEvent('commentId'));
  }
}
