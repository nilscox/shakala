import {
  CommentRepository,
  SetCommentSubscriptionCommand,
  EventHandler,
  ExecutionContext,
  CommentAlreadySubscribedError,
} from 'backend-application';
import { CommentCreatedEvent } from 'backend-domain';

import { CommandBus } from '../../infrastructure';

export class CreateCommentSubscriptionHandler implements EventHandler<CommentCreatedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentRepository: CommentRepository,
  ) {}

  async handle(event: CommentCreatedEvent): Promise<void> {
    const comment = await this.commentRepository.findByIdOrFail(event.commentId);

    try {
      await this.commandBus.execute(
        new SetCommentSubscriptionCommand(comment.author.id, comment.id, true),
        ExecutionContext.unauthenticated,
      );
    } catch (error) {
      if (error instanceof CommentAlreadySubscribedError) {
        return;
      }

      throw error;
    }
  }
}
