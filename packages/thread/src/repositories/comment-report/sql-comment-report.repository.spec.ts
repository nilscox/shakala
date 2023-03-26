import expect from '@nilscox/expect';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';

import { SqlCommentReportRepository } from './sql-comment-report.repository';

describe('SqlCommentReportRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('saves and finds a comment report entity', async () => {
    const user = await test.create.user();
    const { comment } = await test.createComment();

    const commentReport = create.commentReport({ reportedById: user.id, commentId: comment.id });

    await test.repository.save(commentReport);
    await expect(test.repository.findById(commentReport.id)).toResolve(commentReport);
  });

  it('finds a comment report for a given user and comment', async () => {
    const user = await test.create.user();
    const { comment } = await test.createComment();

    const commentReport = await test.create.commentReport({ comment, user });

    await expect(test.repository.findBy({ commentId: comment.id, reportedById: user.id })).toResolve(
      expect.objectWith({ id: commentReport.id })
    );
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlCommentReportRepository(this.database);
  }

  async createComment() {
    const author = await this.create.user();
    const thread = await this.create.thread({ author });
    const comment = await this.create.comment({ thread, author });

    return { author, thread, comment };
  }
}
