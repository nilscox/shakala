import {
  BaseError,
  commandCreator,
  CommandHandler,
  DomainEvent,
  EventPublisher,
  GeneratorPort,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { CommentSubscription } from '../../entities/comment-subscription.entity';
import { CommentRepository } from '../../repositories/comment/comment.repository';
import { CommentSubscriptionRepository } from '../../repositories/comment-subscription/comment-subscription.repository';
import { THREAD_TOKENS } from '../../tokens';

export type SetCommentSubscriptionCommand = {
  commentId: string;
  userId: string;
  subscribed: boolean;
};

const symbol = Symbol('SetCommentSubscriptionCommand');
export const setCommentSubscription = commandCreator<SetCommentSubscriptionCommand>(symbol);

export class SetCommentSubscriptionHandler implements CommandHandler<SetCommentSubscriptionCommand> {
  symbol = symbol;

  constructor(
    private readonly generator: GeneratorPort,
    private readonly publisher: EventPublisher,
    private readonly commentRepository: CommentRepository,
    private readonly commentSubscriptionRepository: CommentSubscriptionRepository
  ) {}

  async handle(command: SetCommentSubscriptionCommand): Promise<void> {
    const { userId, commentId, subscribed } = command;

    if (subscribed) {
      await this.createSubscription(commentId, userId);
    } else {
      await this.deleteSubscription(commentId, userId);
    }
  }

  private async createSubscription(commentId: string, userId: string) {
    const comment = await this.commentRepository.findByIdOrFail(commentId);

    if (comment?.parentId) {
      commentId = comment.parentId;
    }

    if (await this.commentSubscriptionRepository.findForUserAndComment(userId, commentId)) {
      throw new CommentAlreadySubscribedError(commentId, userId);
    }

    const subscription = new CommentSubscription({
      id: await this.generator.generateId(),
      commentId: commentId,
      userId,
    });

    await this.commentSubscriptionRepository.save(subscription);

    this.publisher.publish(new CommentSubscriptionCreatedEvent(subscription.id));
  }

  private async deleteSubscription(commentId: string, userId: string) {
    const subscription = await this.commentSubscriptionRepository.findForUserAndComment(userId, commentId);

    if (!subscription) {
      throw new CommentNotSubscribedError(commentId, userId);
    }

    await this.commentSubscriptionRepository.delete(subscription);

    this.publisher.publish(new CommentSubscriptionDeletedEvent(subscription.id));
  }
}

injected(
  SetCommentSubscriptionHandler,
  TOKENS.generator,
  TOKENS.publisher,
  THREAD_TOKENS.repositories.commentRepository,
  THREAD_TOKENS.repositories.commentSubscriptionRepository
);

export class CommentSubscriptionCreatedEvent extends DomainEvent {
  constructor(subscriptionId: string) {
    super('CommentSubscription', subscriptionId);
  }
}

export class CommentSubscriptionDeletedEvent extends DomainEvent {
  constructor(subscriptionId: string) {
    super('CommentSubscription', subscriptionId);
  }
}

export class CommentAlreadySubscribedError extends BaseError<{ commentId: string; userId: string }> {
  status = 400;

  constructor(commentId: string, userId: string) {
    super('a subscription to the comment already exists for the user', { commentId, userId });
  }
}

export class CommentNotSubscribedError extends BaseError<{ commentId: string; userId: string }> {
  status = 400;

  constructor(commentId: string, userId: string) {
    super('a subscription to the comment does not exists for the user', { commentId, userId });
  }
}
