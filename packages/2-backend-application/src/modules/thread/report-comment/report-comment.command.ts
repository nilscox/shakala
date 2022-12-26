import { CommentService } from 'backend-domain';
import { CommentAlreadyReportedError } from 'shared';

import { Authorize, HasWriteAccess, IsAuthenticated } from '../../../authorization';
import { Command, CommandHandler, IEventBus } from '../../../cqs';
import { CommentRepository, CommentReportRepository } from '../../../interfaces';
import { AuthenticatedExecutionContext, EventPublisher } from '../../../utils';

export class ReportCommentCommand implements Command {
  constructor(public readonly commentId: string, public readonly reason: string | undefined) {}
}

@Authorize(IsAuthenticated, HasWriteAccess)
export class ReportCommentHandler implements CommandHandler<ReportCommentCommand> {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly commentRepository: CommentRepository,
    private readonly commentReportRepository: CommentReportRepository,
    private readonly commentService: CommentService,
  ) {}

  async handle(command: ReportCommentCommand, ctx: AuthenticatedExecutionContext): Promise<void> {
    const { commentId, reason } = command;
    const { user } = ctx;

    const comment = await this.commentRepository.findByIdOrFail(commentId);

    const publisher = new EventPublisher(ctx, comment);

    const existingReport = await this.commentReportRepository.findBy({
      commentId: comment.id,
      reportedById: user.id,
    });

    if (existingReport) {
      throw new CommentAlreadyReportedError(comment.id);
    }

    const report = await this.commentService.report(comment, user, reason);

    await this.commentReportRepository.save(report);
    publisher.publish(this.eventBus);
  }
}
