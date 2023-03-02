import {
  BaseError,
  commandCreator,
  CommandHandler,
  DomainEvent,
  EventPublisher,
  GeneratorPort,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { CommentReport } from '../../entities/comment-report.entity';
import { CommentRepository } from '../../repositories/comment/comment.repository';
import { CommentReportRepository } from '../../repositories/comment-report/comment-report.repository';
import { THREAD_TOKENS } from '../../tokens';

export type ReportCommentCommand = {
  commentId: string;
  userId: string;
  reason?: string;
};

const symbol = Symbol('ReportCommentCommand');
export const reportComment = commandCreator<ReportCommentCommand>(symbol);

export class ReportCommentHandler implements CommandHandler<ReportCommentCommand> {
  symbol = symbol;

  constructor(
    private readonly generator: GeneratorPort,
    private readonly publisher: EventPublisher,
    private readonly commentRepository: CommentRepository,
    private readonly commentReportRepository: CommentReportRepository
  ) {}

  async handle(command: ReportCommentCommand): Promise<void> {
    const { commentId, userId, reason } = command;

    const comment = await this.commentRepository.findByIdOrFail(commentId);

    const existingReport = await this.commentReportRepository.findBy({
      commentId: comment.id,
      reportedById: userId,
    });

    if (existingReport) {
      throw new CommentAlreadyReportedError(comment.id);
    }

    if (userId === comment.authorId) {
      throw new CannotReportOwnCommentError(comment.id);
    }

    const report = new CommentReport({
      id: await this.generator.generateId(),
      commentId: comment.id,
      reportedById: userId,
      reason,
    });

    await this.commentReportRepository.save(report);

    this.publisher.publish(new CommentReportedEvent(commentId, userId, reason));
  }
}

injected(
  ReportCommentHandler,
  TOKENS.generator,
  TOKENS.publisher,
  THREAD_TOKENS.commentRepository,
  THREAD_TOKENS.commentReportRepository
);

export class CommentReportedEvent extends DomainEvent {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly reason?: string
  ) {
    super('Comment', commentId);
  }
}

export class CannotReportOwnCommentError extends BaseError<{ commentId: string }> {
  status = 400;

  constructor(commentId: string) {
    super('user cannot report his own comment', { commentId });
  }
}

export class CommentAlreadyReportedError extends BaseError<{ commentId: string }> {
  status = 400;

  constructor(commentId: string) {
    super('comment already reported by user', { commentId });
  }
}
