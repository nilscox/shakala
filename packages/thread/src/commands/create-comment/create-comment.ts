import {
  commandCreator,
  CommandHandler,
  DatePort,
  DomainEvent,
  EventPublisher,
  GeneratorPort,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { Comment } from '../../entities/comment.entity';
import { Markdown } from '../../entities/markdown.value-object';
import { Message } from '../../entities/message.entity';
import { CommentRepository } from '../../repositories/comment/comment.repository';
import { THREAD_TOKENS } from '../../tokens';

type CreateCommentCommand = {
  commentId: string;
  authorId: string;
  threadId: string;
  parentId?: string;
  text: string;
};

const symbol = Symbol('CreateCommentCommand');
export const createComment = commandCreator<CreateCommentCommand>(symbol);

export class CreateCommentHandler implements CommandHandler<CreateCommentCommand> {
  symbol = symbol;

  constructor(
    private readonly publisher: EventPublisher,
    private readonly generator: GeneratorPort,
    private readonly dateAdapter: DatePort,
    private readonly commentRepository: CommentRepository
  ) {}

  // todo: assert that parentId c threadId
  async handle(command: CreateCommentCommand): Promise<void> {
    const { commentId, authorId, threadId, parentId, text } = command;

    const message = new Message({
      id: await this.generator.generateId(),
      authorId,
      date: this.dateAdapter.now(),
      text: new Markdown(text),
    });

    const comment = new Comment({
      id: commentId,
      threadId,
      authorId,
      parentId,
      messages: [message],
    });

    await this.commentRepository.save(comment);

    if (parentId) {
      this.publisher.publish(new ReplyCreatedEvent(comment.id));
    } else {
      this.publisher.publish(new CommentCreatedEvent(comment.id));
    }
  }
}

injected(
  CreateCommentHandler,
  TOKENS.publisher,
  TOKENS.generator,
  TOKENS.date,
  THREAD_TOKENS.repositories.commentRepository
);

export class CommentCreatedEvent extends DomainEvent {
  constructor(commentId: string) {
    super('Comment', commentId);
  }
}

export class ReplyCreatedEvent extends DomainEvent {
  constructor(replyId: string) {
    super('Comment', replyId);
  }
}
