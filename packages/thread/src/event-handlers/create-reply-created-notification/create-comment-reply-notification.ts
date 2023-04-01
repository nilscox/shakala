import assert from 'assert';

import { CommandBus, EventHandler, QueryBus, registerEventHandler, TOKENS } from '@shakala/common';
import { createNotification } from '@shakala/notification';
import { NotificationPayloadMap, NotificationType } from '@shakala/shared';
import { getUser } from '@shakala/user';
import { injected } from 'brandi';

import { ReplyCreatedEvent } from '../../commands/create-comment/create-comment';
import { CommentRepository } from '../../repositories/comment/comment.repository';
import { CommentSubscriptionRepository } from '../../repositories/comment-subscription/comment-subscription.repository';
import { ThreadRepository } from '../../repositories/thread/thread.repository';
import { THREAD_TOKENS } from '../../tokens';

export class CreateReplyCreatedNotificationsHandler implements EventHandler<ReplyCreatedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly commentSubscriptionRepository: CommentSubscriptionRepository
  ) {}

  async handle(event: ReplyCreatedEvent): Promise<void> {
    const reply = await this.commentRepository.findByIdOrFail(event.id);
    const replyAuthor = await this.queryBus.execute(getUser({ id: reply.authorId }));

    assert(reply.parentId, 'expected reply.parentId to be defined');
    assert(replyAuthor, 'expected reply author to exist');

    const comment = await this.commentRepository.findByIdOrFail(reply.parentId);
    const commentAuthor = await this.queryBus.execute(getUser({ id: comment.authorId }));

    assert(commentAuthor, 'expected comment author to exist');

    const thread = await this.threadRepository.findByIdOrFail(comment.threadId);

    await this.createNotifications({
      threadId: thread.id,
      threadDescription: thread.description,
      parentId: comment.id,
      parentAuthor: {
        id: commentAuthor.id,
        nick: commentAuthor.nick,
      },
      replyId: reply.id,
      replyAuthor: {
        id: replyAuthor.id,
        nick: replyAuthor.nick,
      },
      text: reply.message.toString(),
    });
  }

  private async createNotifications(payload: NotificationPayloadMap[NotificationType.replyCreated]) {
    const subscriptions = await this.commentSubscriptionRepository.findForComment(payload.parentId);

    for (const subscription of subscriptions) {
      if (subscription.userId === payload.replyAuthor.id) {
        continue;
      }

      await this.commandBus.execute(
        createNotification({
          type: NotificationType.replyCreated,
          userId: subscription.userId,
          payload,
        })
      );
    }
  }
}

injected(
  CreateReplyCreatedNotificationsHandler,
  TOKENS.commandBus,
  TOKENS.queryBus,
  THREAD_TOKENS.repositories.threadRepository,
  THREAD_TOKENS.repositories.commentRepository,
  THREAD_TOKENS.repositories.commentSubscriptionRepository
);

registerEventHandler(ReplyCreatedEvent, THREAD_TOKENS.eventHandlers.createReplyCreatedNotificationsHandler);
