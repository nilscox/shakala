import {
  Author,
  Comment,
  CommentSubscription,
  DatePort,
  GeneratorPort,
  Notification,
  Thread,
  Timestamp,
} from '@shakala/backend-domain';
import { isDefined, NotificationType, UnexpectedError } from '@shakala/shared';

import { Command, CommandHandler } from '../../../cqs';
import {
  CommentRepository,
  CommentSubscriptionRepository,
  NotificationRepository,
  ThreadRepository,
} from '../../../interfaces';

export class CreateCommentReplyNotificationsCommand implements Command {
  constructor(public readonly replyId: string) {}
}

export class CreateCommentReplyNotificationsHandler
  implements CommandHandler<CreateCommentReplyNotificationsCommand>
{
  constructor(
    private readonly generator: GeneratorPort,
    private readonly date: DatePort,
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly commentSubscriptionRepository: CommentSubscriptionRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async handle(command: CreateCommentReplyNotificationsCommand): Promise<void> {
    const { replyId } = command;

    const reply = await this.commentRepository.findByIdOrFail(replyId);

    if (!reply.parentId) {
      throw new UnexpectedError('comment is not a reply', { commentId: replyId });
    }

    const parent = await this.commentRepository.findByIdOrFail(reply.parentId);
    const subscriptions = await this.commentSubscriptionRepository.findByCommentId(parent.id);
    const notifications = await this.createNotifications(parent, reply, subscriptions);

    // todo: bulk save
    for (const notification of notifications) {
      await this.notificationRepository.save(notification);
    }
  }

  private async createNotifications(comment: Comment, reply: Comment, subscriptions: CommentSubscription[]) {
    const thread = await this.threadRepository.findByIdOrFail(comment.threadId);

    const notifications = await Promise.all(
      subscriptions.map((subscription) => this.createNotification(thread, comment, reply, subscription)),
    );

    return notifications.filter(isDefined);
  }

  private async createNotification(
    thread: Thread,
    comment: Comment,
    reply: Comment,
    subscription: CommentSubscription,
  ) {
    if (reply.author.id === subscription.userId) {
      return;
    }

    return Notification.create(NotificationType.replyCreated, {
      id: await this.generator.generateId(),
      date: Timestamp.now(this.date),
      userId: subscription.userId,
      payload: {
        threadId: thread.id,
        threadDescription: thread.description,
        parentId: comment.id,
        parentAuthor: this.createAuthorPayload(comment.author),
        replyId: reply.id,
        replyAuthor: this.createAuthorPayload(reply.author),
        text: reply.message.toString(),
      },
    });
  }

  private createAuthorPayload(author: Author) {
    return {
      id: author.id,
      nick: author.nick.toString(),
      profileImage: author.profileImage?.toString(),
    };
  }
}
