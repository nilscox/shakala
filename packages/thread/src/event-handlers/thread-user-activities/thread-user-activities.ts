import { CommandBus, DomainEvent, EventHandler, registerEventHandler, TOKENS } from '@shakala/common';
import { createUserActivity, UserActivityPayload, UserActivityType } from '@shakala/user';
import { injected } from 'brandi';

import { CommentCreatedEvent } from '../../commands/create-comment/create-comment';
import { ThreadCreatedEvent } from '../../commands/create-thread/create-thread';
import { CommentEditedEvent } from '../../commands/edit-comment/edit-comment';
import { CommentReportedEvent } from '../../commands/report-comment/report-comment';
import { CommentReactionChangedEvent } from '../../commands/set-reaction/set-reaction';
import { CommentRepository } from '../../repositories/comment/comment.repository';
import { ThreadRepository } from '../../repositories/thread/thread.repository';
import { THREAD_TOKENS } from '../../tokens';

export class ThreadUserActivitiesHandler implements EventHandler<DomainEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof ThreadCreatedEvent) {
      await this.threadCreated(event);
    }

    if (event instanceof CommentCreatedEvent) {
      await this.commentCreated(event);
    }

    if (event instanceof CommentEditedEvent) {
      await this.commentEdited(event);
    }

    if (event instanceof CommentReactionChangedEvent) {
      await this.commentReactionChanged(event);
    }

    if (event instanceof CommentReportedEvent) {
      await this.commentReported(event);
    }
  }

  private async threadCreated(event: ThreadCreatedEvent) {
    const thread = await this.threadRepository.findByIdOrFail(event.id);

    await this.createActivity(UserActivityType.threadCreated, thread.authorId, {
      threadId: thread.id,
      description: thread.description,
      text: thread.text.toString(),
    });
  }

  private async commentCreated(event: CommentCreatedEvent) {
    const [payload, { comment }] = await this.commentActivityPayload(event.id);

    if (comment.parentId) {
      await this.createActivity(UserActivityType.replyCreated, comment.authorId, {
        ...payload,
        parentId: comment.parentId,
      });
    } else {
      await this.createActivity(UserActivityType.rootCommentCreated, comment.authorId, payload);
    }
  }

  private async commentEdited(event: CommentEditedEvent) {
    const [payload, { comment }] = await this.commentActivityPayload(event.id);

    await this.createActivity(UserActivityType.commentEdited, comment.authorId, payload);
  }

  private async commentReactionChanged(event: CommentReactionChangedEvent) {
    const [payload] = await this.commentActivityPayload(event.id);

    await this.createActivity(UserActivityType.commentReactionSet, event.userId, {
      ...payload,
      reaction: event.nextReaction,
    });
  }

  private async commentReported(event: CommentReportedEvent) {
    const [payload] = await this.commentActivityPayload(event.id);

    await this.createActivity(UserActivityType.commentReported, event.userId, payload);
  }

  private async createActivity<Type extends UserActivityType>(
    type: Type,
    userId: string,
    payload: UserActivityPayload[Type]
  ) {
    await this.commandBus.execute(createUserActivity({ type, userId, payload }));
  }

  private async commentActivityPayload(commentId: string) {
    const comment = await this.commentRepository.findByIdOrFail(commentId);
    const thread = await this.threadRepository.findByIdOrFail(comment.threadId);

    return [
      {
        threadId: thread.id,
        threadDescription: thread.description,
        commentId: comment.id,
        commentText: comment.message.toString(),
      },
      {
        comment,
        thread,
      },
    ] as const;
  }
}

injected(
  ThreadUserActivitiesHandler,
  TOKENS.commandBus,
  THREAD_TOKENS.repositories.threadRepository,
  THREAD_TOKENS.repositories.commentRepository
);

registerEventHandler(ThreadCreatedEvent, THREAD_TOKENS.eventHandlers.threadUserActivitiesHandler);
registerEventHandler(CommentCreatedEvent, THREAD_TOKENS.eventHandlers.threadUserActivitiesHandler);
registerEventHandler(CommentEditedEvent, THREAD_TOKENS.eventHandlers.threadUserActivitiesHandler);
registerEventHandler(CommentReactionChangedEvent, THREAD_TOKENS.eventHandlers.threadUserActivitiesHandler);
registerEventHandler(CommentReportedEvent, THREAD_TOKENS.eventHandlers.threadUserActivitiesHandler);
