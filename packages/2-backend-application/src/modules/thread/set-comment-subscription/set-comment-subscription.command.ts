import { Comment, CommentSubscription, GeneratorPort, User } from 'backend-domain';
import { BaseError } from 'shared';

import { Authorize, IsAuthenticated } from '../../../authorization';
import { CommandHandler, IEventBus } from '../../../cqs';
import { CommentRepository, CommentSubscriptionRepository, UserRepository } from '../../../interfaces';
import { EventPublisher, ExecutionContext } from '../../../utils';

export class SetCommentSubscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly commentId: string,
    public readonly subscribe: boolean,
  ) {}
}

@Authorize(IsAuthenticated)
export class SetCommentSubscriptionCommandHandler implements CommandHandler<SetCommentSubscriptionCommand> {
  constructor(
    private readonly generator: GeneratorPort,
    private readonly eventBus: IEventBus,
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
    private readonly commentSubscriptionRepository: CommentSubscriptionRepository,
  ) {}

  async handle(command: SetCommentSubscriptionCommand): Promise<void> {
    const { userId, commentId, subscribe } = command;

    const subscription = await this.commentSubscriptionRepository.findForUserAndComment(userId, commentId);

    if (subscribe) {
      if (subscription) {
        throw new CommentAlreadySubscribedError(userId, commentId);
      }

      const user = await this.userRepository.findByIdOrFail(userId);
      const comment = await this.commentRepository.findByIdOrFail(commentId);

      await this.createSubscription(user, comment);
    } else {
      await this.commentRepository.findByIdOrFail(command.commentId);
      if (!subscription) {
        throw new CommentNotSubscribedError(userId, commentId);
      }

      await this.deleteSubscription(subscription);
    }
  }

  private async createSubscription(user: User, comment: Comment) {
    let commentId = comment.id;

    if (comment?.parentId) {
      commentId = comment.parentId;
    }

    const subscription = new CommentSubscription({
      id: await this.generator.generateId(),
      commentId: commentId,
      userId: user.id,
    });

    const publisher = new EventPublisher(ExecutionContext.unauthenticated, subscription);

    await this.commentSubscriptionRepository.save(subscription);
    publisher.publish(this.eventBus);
  }

  private async deleteSubscription(subscription: CommentSubscription) {
    await this.commentSubscriptionRepository.delete(subscription);
  }
}

export const CommentAlreadySubscribedError = BaseError.extend(
  'a subscription to the comment already exists for the user',
  (userId: string, commentId: string) => ({ userId, commentId }),
);

export const CommentNotSubscribedError = BaseError.extend(
  'a subscription to the comment does not exists for the user',
  (userId: string, commentId: string) => ({ userId, commentId }),
);
