import expect from '@nilscox/expect';
import { EntityNotFoundError, StubEventPublisher, StubGeneratorAdapter } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { CommentSubscription } from '../../entities/comment-subscription.entity';
import { create } from '../../factories';
import { InMemoryCommentRepository } from '../../repositories/comment/in-memory-comment.repository';
import { InMemoryCommentSubscriptionRepository } from '../../repositories/comment-subscription/in-memory-comment-subscription.repository';

import {
  CommentAlreadySubscribedError,
  CommentNotSubscribedError,
  SetCommentSubscriptionHandler,
} from './set-comment-subscription';

describe('SetCommentSubscriptionCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a new subscription to a root comment', async () => {
    await test.act('commentId', true);

    const subscription = await test.getSubscription('commentId');

    expect.assert(subscription);
    expect(subscription).toHaveProperty('userId', 'userId');
    expect(subscription).toHaveProperty('commentId', 'commentId');
  });

  it('creates a new subscription to a root comment by subscribing to one of its replies', async () => {
    await test.act('replyId', true);

    const subscription = await test.getSubscription('commentId');

    expect.assert(subscription);
    expect(subscription).toHaveProperty('userId', 'userId');
    expect(subscription).toHaveProperty('commentId', 'commentId');
  });

  it('throws a CommentAlreadySubscribedError when a subscription already exists', async () => {
    const subscription = create.commentSubscription({ commentId: 'commentId', userId: 'userId' });

    test.addSubscription(subscription);

    await expect(test.act('commentId', true)).toReject(
      new CommentAlreadySubscribedError('commentId', 'userId')
    );
  });

  it('throws a CommentAlreadySubscribedError when subscribing to a reply', async () => {
    const subscription = create.commentSubscription({ commentId: 'commentId', userId: 'userId' });

    test.addSubscription(subscription);

    await expect(test.act('replyId', true)).toReject(
      new CommentAlreadySubscribedError('commentId', 'userId')
    );
  });

  it('throws a error when the comment does not exist', async () => {
    await expect(test.act('notExistingCommentId', true)).toReject(
      new EntityNotFoundError('Comment', { id: 'notExistingCommentId' })
    );
  });

  it('removes a new subscription to a root comment', async () => {
    const subscription = create.commentSubscription({
      id: 'subscriptionId',
      commentId: 'commentId',
      userId: 'userId',
    });

    test.addSubscription(subscription);

    await test.act('commentId', false);

    expect(test.commentSubscriptionRepository.get('subscriptionId')).toBeUndefined();
  });

  it('throws a CommentNotSubscribedError when the subscription does not exist', async () => {
    await expect(test.act('commentId', false)).toReject(new CommentNotSubscribedError('commentId', 'userId'));
  });
});

class Test {
  comment = create.comment({ id: 'commentId' });
  reply = create.comment({ id: 'replyId', parentId: 'commentId' });

  generator = new StubGeneratorAdapter();
  publisher = new StubEventPublisher();
  commentRepository = new InMemoryCommentRepository([this.comment, this.reply]);
  commentSubscriptionRepository = new InMemoryCommentSubscriptionRepository();

  handler = new SetCommentSubscriptionHandler(
    this.generator,
    this.publisher,
    this.commentRepository,
    this.commentSubscriptionRepository
  );

  constructor() {
    this.generator.nextId = 'subscriptionId';
  }

  async getSubscription(commentId: string) {
    return this.commentSubscriptionRepository.findForUserAndComment('userId', commentId);
  }

  addSubscription(subscription: CommentSubscription) {
    return this.commentSubscriptionRepository.add(subscription);
  }

  async act(commentId: string, subscribed: boolean) {
    await this.handler.handle({
      commentId,
      userId: 'userId',
      subscribed,
    });
  }
}
