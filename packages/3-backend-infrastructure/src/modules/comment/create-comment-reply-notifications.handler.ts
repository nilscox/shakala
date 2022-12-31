import {
  CreateCommentReplyNotificationsCommand,
  EventHandler,
  ExecutionContext,
} from '@shakala/backend-application';
import { CommentReplyCreatedEvent } from '@shakala/backend-domain';

import { CommandBus } from '../../infrastructure';

export class CreateCommentReplyNotificationsHandlerInfra implements EventHandler<CommentReplyCreatedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: CommentReplyCreatedEvent): Promise<void> {
    await this.commandBus.execute(
      new CreateCommentReplyNotificationsCommand(event.replyId),
      ExecutionContext.unauthenticated,
    );
  }
}
