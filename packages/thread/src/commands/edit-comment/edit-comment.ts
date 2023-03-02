import {
  BaseError,
  commandCreator,
  CommandHandler,
  DatePort,
  DomainEvent,
  EventPublisher,
  GeneratorPort,
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

const symbol = Symbol('EditCommentCommand');
export const editComment = commandCreator<EditCommentCommand>(symbol);

export class EditCommentHandler implements CommandHandler<EditCommentCommand> {
  symbol = symbol;

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
      authorId,
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
  THREAD_TOKENS.commentRepository
);

export class UserMustBeAuthorError extends BaseError<{ userId: string; commentId: string }> {
  constructor(userId: string, commentId: string) {
    super('user must be the author of the comment', { userId, commentId });
  }
}

export class CommentEditedEvent extends DomainEvent {
  constructor(commentId: string) {
    super('Comment', commentId);
  }
}
