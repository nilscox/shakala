import { CommandBus, EventHandler, registerEventHandler, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { CommentCreatedEvent, ReplyCreatedEvent } from '../../commands/create-comment/create-comment';
import { setCommentSubscription } from '../../commands/set-comment-subscription/set-comment-subscription';
import { CommentRepository } from '../../repositories/comment/comment.repository';
import { THREAD_TOKENS } from '../../tokens';

export class CreateCommentCreatedSubscriptionHandler
  implements EventHandler<CommentCreatedEvent | ReplyCreatedEvent>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentRepository: CommentRepository
  ) {}

  async handle(event: CommentCreatedEvent | ReplyCreatedEvent): Promise<void> {
    const comment = await this.commentRepository.findByIdOrFail(event.id);

    await this.commandBus.execute(
      setCommentSubscription({
        commentId: comment.id,
        userId: comment.authorId,
        subscribed: true,
      })
    );
  }
}

injected(
  CreateCommentCreatedSubscriptionHandler,
  TOKENS.commandBus,
  THREAD_TOKENS.repositories.commentRepository
);

registerEventHandler(
  CommentCreatedEvent,
  THREAD_TOKENS.eventHandlers.createCommentCreatedSubscriptionHandler
);

registerEventHandler(ReplyCreatedEvent, THREAD_TOKENS.eventHandlers.createCommentCreatedSubscriptionHandler);
