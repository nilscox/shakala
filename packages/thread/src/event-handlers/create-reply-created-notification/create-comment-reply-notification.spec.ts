import { expect, StubCommandBus, StubQueryBus } from '@shakala/common';
import { createNotification, NotificationPayloadMap, NotificationType } from '@shakala/notification';
import { getUser } from '@shakala/user';
import { beforeEach, describe, it } from 'vitest';

import { ReplyCreatedEvent } from '../../commands/create-comment/create-comment';
import { create } from '../../factories';
import { InMemoryCommentRepository } from '../../repositories/comment/in-memory-comment.repository';
import { InMemoryCommentSubscriptionRepository } from '../../repositories/comment-subscription/in-memory-comment-subscription.repository';
import { InMemoryThreadRepository } from '../../repositories/thread/in-memory-thread.repository';

import { CreateReplyCreatedNotificationsHandler } from './create-comment-reply-notification';

describe('CreateReplyCreatedNotificationsHandler', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a notification for all comment subscriptions when a reply is created', async () => {
    await test.act();

    const payload: NotificationPayloadMap[NotificationType.replyCreated] = {
      threadId: 'threadId',
      threadDescription: 'description',
      parentId: 'parentId',
      parentAuthor: {
        id: 'parentAuthorId',
        nick: 'parentAuthor',
      },
      replyId: 'replyId',
      replyAuthor: {
        id: 'replyAuthorId',
        nick: 'replyAuthor',
      },
      text: 'text',
    };

    expect(test.commandBus).toInclude(
      createNotification({
        type: NotificationType.replyCreated,
        userId: 'userId',
        payload,
      })
    );
  });

  it('does not send a notification when answering own comment', async () => {
    test.queryBus.on(getUser({ id: 'userId' })).return({
      id: 'userId',
      email: '',
      emailValidated: true,
      nick: '',
    });

    test.commentRepository.add(
      create.comment({
        id: 'replyId',
        threadId: 'threadId',
        parentId: 'parentId',
        authorId: 'userId',
      })
    );

    await test.act();

    expect(test.commandBus).toHaveLength(0);
  });
});

class Test {
  readonly thread = create.thread({
    id: 'threadId',
    description: 'description',
  });

  readonly parent = create.comment({
    id: 'parentId',
    threadId: 'threadId',
    authorId: 'parentAuthorId',
  });

  readonly reply = create.comment({
    id: 'replyId',
    threadId: 'threadId',
    parentId: 'parentId',
    authorId: 'replyAuthorId',
    messages: [create.message({ text: create.markdown('text') })],
  });

  readonly subscription = create.commentSubscription({ commentId: 'parentId', userId: 'userId' });

  readonly commandBus = new StubCommandBus();
  readonly queryBus = new StubQueryBus();
  readonly threadRepository = new InMemoryThreadRepository([this.thread]);
  readonly commentRepository = new InMemoryCommentRepository([this.parent, this.reply]);
  readonly commentSubscriptionRepository = new InMemoryCommentSubscriptionRepository([this.subscription]);

  private handler = new CreateReplyCreatedNotificationsHandler(
    this.commandBus,
    this.queryBus,
    this.threadRepository,
    this.commentRepository,
    this.commentSubscriptionRepository
  );

  constructor() {
    this.queryBus.on(getUser({ id: 'parentAuthorId' })).return({
      id: 'parentAuthorId',
      email: '',
      emailValidated: true,
      nick: 'parentAuthor',
    });

    this.queryBus.on(getUser({ id: 'replyAuthorId' })).return({
      id: 'replyAuthorId',
      email: '',
      emailValidated: true,
      nick: 'replyAuthor',
    });
  }

  async act() {
    await this.handler.handle(new ReplyCreatedEvent('replyId'));
  }
}
