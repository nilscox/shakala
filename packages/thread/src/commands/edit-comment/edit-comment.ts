import {
  BaseError,
  commandCreator,
  CommandHandler,
  DatePort,
  DomainEvent,
  EventPublisher,
  GeneratorPort,
  registerCommand,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { Markdown } from '../../entities/markdown.value-object';
import { Message } from '../../entities/message.entity';
import { CommentRepository } from '../../repositories/comment/comment.repository';
import { THREAD_TOKENS } from '../../tokens';

export type EditCommentCommand = {
  commentId: string;
  authorId: string;
  text: string;
};

export const editComment = commandCreator<EditCommentCommand>('editComment');

export class EditCommentHandler implements CommandHandler<EditCommentCommand> {
  constructor(
    private readonly generator: GeneratorPort,
    private readonly dateAdapter: DatePort,
    private readonly publisher: EventPublisher,
    private readonly commentRepository: CommentRepository
  ) {}

  async handle(command: EditCommentCommand): Promise<void> {
    const { authorId, commentId, text } = command;

    const comment = await this.commentRepository.findByIdOrFail(commentId);

    if (authorId !== comment.authorId) {
      throw new UserMustBeAuthorError(authorId, comment.id);
    }

    comment.message = new Message({
      id: await this.generator.generateId(),
      date: this.dateAdapter.now(),
      text: new Markdown(text),
    });

    await this.commentRepository.save(comment);

    this.publisher.publish(new CommentEditedEvent(comment.id));
  }
}

injected(
  EditCommentHandler,
  TOKENS.generator,
  TOKENS.date,
  TOKENS.publisher,
  THREAD_TOKENS.repositories.commentRepository
);

registerCommand(editComment, THREAD_TOKENS.commands.editCommentHandler);

export class UserMustBeAuthorError extends BaseError<{ userId: string; commentId: string }> {
  status = 403;

  constructor(userId: string, commentId: string) {
    super('user must be the author of the comment', { userId, commentId });
  }
}

export class CommentEditedEvent extends DomainEvent {
  constructor(commentId: string) {
    super('Comment', commentId);
  }
}
