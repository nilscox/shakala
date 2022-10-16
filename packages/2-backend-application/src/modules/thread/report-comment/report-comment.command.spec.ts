import {
  CannotReportOwnCommentError,
  CommentService,
  factories,
  StubGeneratorAdapter,
  CommentAlreadyReportedError,
  CommentReportedEvent,
} from 'backend-domain';

import { InMemoryCommentRepository, InMemoryCommentReportRepository, StubEventBus } from '../../../adapters';
import { ExecutionContext } from '../../../utils';

import { ReportCommentCommand, ReportCommentHandler } from './report-comment.command';

describe('ReportCommentCommand', () => {
  const eventBus = new StubEventBus();
  const generator = new StubGeneratorAdapter();
  const commentService = new CommentService(generator);

  const commentRepository = new InMemoryCommentRepository();
  const commentReportRepository = new InMemoryCommentReportRepository();

  const handler = new ReportCommentHandler(
    eventBus,
    commentRepository,
    commentReportRepository,
    commentService,
  );

  const create = factories();

  const author = create.user();
  const comment = create.comment({ author });
  const user = create.user();

  beforeEach(() => {
    commentRepository.add(comment);
    generator.nextId = 'reportId';
  });

  it('creates a new comment report', async () => {
    await handler.handle(new ReportCommentCommand(comment.id, undefined), ExecutionContext.as(user));

    const report = commentReportRepository.get('reportId');

    expect(report).toHaveProperty('id', 'reportId');
    expect(report).toHaveProperty('commentId', comment.id);
    expect(report).toHaveProperty('reportedBy', user);
    expect(report).toHaveProperty('reason', null);

    expect(eventBus).toHaveEmitted(new CommentReportedEvent(comment.id, user.id, undefined));
  });

  it('creates a new comment report with a reason', async () => {
    const reason = 'reason';

    await handler.handle(new ReportCommentCommand(comment.id, reason), ExecutionContext.as(user));

    expect(commentReportRepository.get('reportId')).toHaveProperty('reason', 'reason');

    expect(eventBus).toHaveEmitted(new CommentReportedEvent(comment.id, user.id, 'reason'));
  });

  it('prevents a user to report the same comment twice', async () => {
    commentReportRepository.add(create.commentReport({ commentId: comment.id, reportedBy: user }));

    await expect
      .rejects(handler.handle(new ReportCommentCommand(comment.id, undefined), ExecutionContext.as(user)))
      .with(CommentAlreadyReportedError);
  });

  it('prevents a user to report his own comment', async () => {
    await expect
      .rejects(handler.handle(new ReportCommentCommand(comment.id, undefined), ExecutionContext.as(author)))
      .with(CannotReportOwnCommentError);
  });
});
