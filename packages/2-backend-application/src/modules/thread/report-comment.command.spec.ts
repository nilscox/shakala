import {
  CannotReportOwnCommentError,
  CommentService,
  factories,
  StubGeneratorService,
  CommentAlreadyReportedError,
} from 'backend-domain';

import { ExecutionContext } from '../../utils/execution-context';

import { InMemoryCommentReportRepository } from './comment-report.in-memory-repository';
import { InMemoryCommentRepository } from './comment.in-memory-repository';
import { ReportCommentCommand, ReportCommentHandler } from './report-comment.command';

describe('ReportCommentCommand', () => {
  const generatorService = new StubGeneratorService();
  const commentService = new CommentService(generatorService);

  const commentRepository = new InMemoryCommentRepository();
  const commentReportRepository = new InMemoryCommentReportRepository();

  const handler = new ReportCommentHandler(commentRepository, commentReportRepository, commentService);

  const create = factories();

  const author = create.user();
  const comment = create.comment({ author });
  const user = create.user();

  beforeEach(() => {
    commentRepository.add(comment);
    generatorService.nextId = 'reportId';
  });

  it('creates a new comment report', async () => {
    await handler.handle(new ReportCommentCommand(comment.id, undefined), ExecutionContext.as(user));

    const report = commentReportRepository.get('reportId');

    expect(report).toHaveProperty('id', 'reportId');
    expect(report).toHaveProperty('commentId', comment.id);
    expect(report).toHaveProperty('reportedBy', user);
    expect(report).toHaveProperty('reason', null);
  });

  it('creates a new comment report with a reason', async () => {
    const reason = 'reason';

    await handler.handle(new ReportCommentCommand(comment.id, reason), ExecutionContext.as(user));

    expect(commentReportRepository.get('reportId')).toHaveProperty('reason', 'reason');
  });

  it('prevents a user to report the same comment twice', async () => {
    commentReportRepository.add(create.commentReport({ commentId: comment.id, reportedBy: user }));

    await expect(
      handler.handle(new ReportCommentCommand(comment.id, undefined), ExecutionContext.as(user)),
    ).rejects.toThrow(CommentAlreadyReportedError);
  });

  it('prevents a user to report his own comment', async () => {
    await expect(
      handler.handle(new ReportCommentCommand(comment.id, undefined), ExecutionContext.as(author)),
    ).rejects.toThrow(CannotReportOwnCommentError);
  });
});
