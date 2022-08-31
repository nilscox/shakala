import { Sort } from 'backend-application';
import { createDomainDependencies, factories, StubDateService } from 'backend-domain';

import { MathRandomGeneratorService } from '../../infrastructure';
import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlCommentRepository } from './sql-comment.repository';

describe('SqlCommentRepository', () => {
  let repository: SqlCommentRepository;

  const generatorService = new MathRandomGeneratorService();
  const dateService = new StubDateService();

  const deps = createDomainDependencies({ generatorService, dateService });
  const create = factories(deps);

  const { save, getEntityManager } = setupTestDatabase();

  beforeEach(async () => {
    const em = getEntityManager();

    repository = new SqlCommentRepository(em, deps);
  });

  it('saves and finds a comment', async () => {
    const author = create.author(await save(create.user()));
    const thread = await save(create.thread({ author }));
    const comment = create.comment({ threadId: thread.id, author });

    await repository.save(comment);
    expect(await repository.findById(comment.id)).toEqual(comment);
  });

  it('saves and edited comment', async () => {
    const user = await save(create.user());
    const author = create.author(user);
    const thread = await save(create.thread({ author }));

    const comment = create.comment({
      threadId: thread.id,
      author,
      message: create.message({
        author,
        text: create.markdown('initial text'),
        date: create.timestamp('2022-01-02'),
      }),
      history: [],
    });

    await repository.save(comment);

    await comment.edit(user, 'edited text');
    await repository.save(comment);

    expect(await repository.findById(comment.id)).toEqual(comment);
  });

  it("finds a thread's root comments", async () => {
    const author = create.author(await save(create.user()));
    const thread = await save(create.thread({ author }));
    const parent = await save(create.comment({ threadId: thread.id, author }));
    await save(create.comment({ threadId: thread.id, author, parentId: parent.id }));

    expect(await repository.findRoots(thread.id, Sort.relevance)).toEqual([parent]);
  });

  it("finds a thread's root comments, sorted by date", async () => {
    const author = create.author(await save(create.user()));
    const thread = await save(create.thread({ author }));

    const comment1 = await save(create.comment({ threadId: thread.id, author }));
    const comment2 = await save(create.comment({ threadId: thread.id, author }));

    expect(await repository.findRoots(thread.id, Sort.dateAsc)).toEqual([comment1, comment2]);
    expect(await repository.findRoots(thread.id, Sort.dateDesc)).toEqual([comment2, comment1]);
  });

  it("finds a comment's replies", async () => {
    const author = create.author(await save(create.user()));
    const thread = await save(create.thread({ author }));
    const parent = await save(create.comment({ threadId: thread.id, author }));
    const reply = await save(create.comment({ threadId: thread.id, author, parentId: parent.id }));

    expect(await repository.findReplies([parent.id])).toEqual(new Map([[parent.id, [reply]]]));
  });
});
