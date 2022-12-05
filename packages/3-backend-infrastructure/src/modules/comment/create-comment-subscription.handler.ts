import {
  CommentRepository,
  CreateCommentSubscriptionCommand,
  EventHandler,
  ExecutionContext,
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

    await this.commandBus.execute(
      new CreateCommentSubscriptionCommand(comment.author.id, comment.id),
      ExecutionContext.unauthenticated,
    );
  }
}
