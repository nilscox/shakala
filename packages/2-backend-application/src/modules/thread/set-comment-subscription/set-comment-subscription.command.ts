import { CommentSubscription, GeneratorPort } from 'backend-domain';

import { CommandHandler, IEventBus } from '../../../cqs';
import { CommentRepository, CommentSubscriptionRepository } from '../../../interfaces';
import { EventPublisher, ExecutionContext } from '../../../utils';

export class SetCommentSubscriptionCommand {
  constructor(public readonly userId: string, public readonly commentId: string) {}
}

export class SetCommentSubscriptionCommandHandler implements CommandHandler<SetCommentSubscriptionCommand> {
  constructor(
    private readonly generator: GeneratorPort,
    private readonly eventBus: IEventBus,
    private readonly commentRepository: CommentRepository,
    private readonly commentSubscriptionRepository: CommentSubscriptionRepository,
  ) {}

  async handle(command: SetCommentSubscriptionCommand): Promise<void> {
    const { userId } = command;
    let { commentId } = command;

    const comment = await this.commentRepository.findById(commentId);

    if (comment?.parentId) {
      commentId = comment.parentId;
    }

    const subscription = new CommentSubscription({
      id: await this.generator.generateId(),
      commentId,
      userId,
    });

    const publisher = new EventPublisher(ExecutionContext.unauthenticated, subscription);

    await this.commentSubscriptionRepository.save(subscription);
    publisher.publish(this.eventBus);
  }
}
