import { createComment, createThread, createUser, Sort } from 'backend-application';

import { createTestDatabaseConnection } from '../mikro-orm/create-database-connection';
import { SaveEntity, sqlHelpers } from '../utils/save-test-data';

import { SqlCommentRepository } from './sql-comment.repository';

describe('SqlCommentRepository', () => {
  let save: SaveEntity;
  let repository: SqlCommentRepository;

  beforeEach(async () => {
    const { em } = await createTestDatabaseConnection();

    save = sqlHelpers(em.fork()).save;
    repository = new SqlCommentRepository(em.fork());
  });

  it('saves and finds a comment', async () => {
    const author = await save(createUser());
    const thread = await save(createThread({ author }));
    const comment = createComment({ threadId: thread.id, author });

    await repository.save(comment);

    expect(await repository.findById(comment.id)).toEqual(comment);
  });

  it("finds a thread's root comments", async () => {
    const author = await save(createUser());
    const thread = await save(createThread({ author }));
    const parent = await save(createComment({ threadId: thread.id, author }));
    await save(createComment({ threadId: thread.id, author, parentId: parent.id }));

    expect(await repository.findRoots(thread.id, Sort.relevance)).toEqual([parent]);
  });

  it("finds a comment's replies", async () => {
    const author = await save(createUser());
    const thread = await save(createThread({ author }));
    const parent = await save(createComment({ threadId: thread.id, author }));
    const reply = await save(createComment({ threadId: thread.id, author, parentId: parent.id }));

    expect(await repository.findReplies([parent.id])).toEqual(new Map([[parent.id, [reply]]]));
  });
});
