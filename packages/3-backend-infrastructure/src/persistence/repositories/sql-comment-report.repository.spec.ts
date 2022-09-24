import { createDomainDependencies, factories } from 'backend-domain';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlCommentReportRepository } from './sql-comment-report.repository';

describe('SqlCommentReportRepository', () => {
  let repository: SqlCommentReportRepository;

  const deps = createDomainDependencies();
  const create = factories(deps);

  const { save, getEntityManager } = setupTestDatabase();

  beforeEach(async () => {
    const em = getEntityManager();

    repository = new SqlCommentReportRepository(em, deps);
  });

  it('saves and finds a comment report', async () => {
    const author = await save(create.user());
    const reporter = await save(create.user());
    const thread = await save(create.thread({ author }));
    const comment = await save(create.comment({ threadId: thread.id, author }));

    const report = create.commentReport({
      commentId: comment.id,
      reportedBy: reporter,
      reason: 'reason',
    });

    await repository.save(report);
    expect(await repository.findById(report.id)).toEqual(report);
  });

  it('finds a report for a given commentId and reportedById', async () => {
    const author = await save(create.user());
    const reporter = await save(create.user());
    const thread = await save(create.thread({ author }));
    const comment = await save(create.comment({ threadId: thread.id, author }));

    const report = create.commentReport({
      commentId: comment.id,
      reportedBy: reporter,
      reason: 'reason',
    });

    await repository.save(report);

    expect(await repository.findBy({ commentId: '', reportedById: '' })).toBeUndefined();
    expect(await repository.findBy({ commentId: comment.id, reportedById: reporter.id })).toEqual(report);
  });
});
