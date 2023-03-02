import { expect, StubEventPublisher, StubGeneratorAdapter } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';
import { InMemoryCommentRepository } from '../../repositories/comment/in-memory-comment.repository';
import { InMemoryCommentReportRepository } from '../../repositories/comment-report/in-memory-comment-report.repository';

import {
  CannotReportOwnCommentError,
  CommentAlreadyReportedError,
  CommentReportedEvent,
  ReportCommentHandler,
} from './report-comment';

describe('ReportCommentCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a new comment report', async () => {
    await test.act();

    const report = test.getReport();

    expect(report).toHaveProperty('id', 'reportId');
    expect(report).toHaveProperty('commentId', 'commentId');
    expect(report).toHaveProperty('reportedById', 'userId');
    expect(report).toHaveProperty('reason', undefined);
  });

  it('publishes a CommentReportedEvent', async () => {
    await test.act();

    expect(test.publisher).toHavePublished(new CommentReportedEvent('commentId', 'userId', undefined));
  });

  it('creates a new comment report with a reason', async () => {
    await test.act('reason');

    expect(test.getReport()).toHaveProperty('reason', 'reason');
    expect(test.publisher).toHavePublished(new CommentReportedEvent('commentId', 'userId', 'reason'));
  });

  it('prevents a user to report the same comment twice', async () => {
    test.commentReportRepository.add(
      create.commentReport({ commentId: 'commentId', reportedById: 'userId' })
    );

    await expect(test.act()).toRejectWith(CommentAlreadyReportedError);
  });

  it('prevents a user to report his own comment', async () => {
    test.commentRepository.add(create.comment({ id: 'commentId', authorId: 'userId' }));

    await expect(test.act()).toRejectWith(CannotReportOwnCommentError);
  });
});

class Test {
  comment = create.comment({ id: 'commentId', authorId: 'authorId' });

  generator = new StubGeneratorAdapter();
  publisher = new StubEventPublisher();
  commentRepository = new InMemoryCommentRepository([this.comment]);
  commentReportRepository = new InMemoryCommentReportRepository();

  handler = new ReportCommentHandler(
    this.generator,
    this.publisher,
    this.commentRepository,
    this.commentReportRepository
  );

  constructor() {
    this.generator.nextId = 'reportId';
  }

  getReport() {
    return this.commentReportRepository.get('reportId');
  }

  async act(reason?: string) {
    await this.handler.handle({ commentId: 'commentId', userId: 'userId', reason });
  }
}
