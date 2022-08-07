import {
  createComment,
  createMessage,
  createThread,
  createUser,
  Sort,
  StubDateService,
} from 'backend-application';
import { Author, Markdown, Timestamp } from 'backend-domain';

import { MathRandomGeneratorService } from '../../infrastructure';
import { createTestDatabaseConnection } from '../mikro-orm/create-database-connection';
import { SaveEntity, sqlHelpers } from '../utils/save-test-data';

import { SqlCommentRepository } from './sql-comment.repository';

describe('SqlCommentRepository', () => {
  let save: SaveEntity;
  let repository: SqlCommentRepository;

  const generatorService = new MathRandomGeneratorService();

  beforeEach(async () => {
    const { em } = await createTestDatabaseConnection();

    save = sqlHelpers(em.fork()).save;
    repository = new SqlCommentRepository(em.fork(), generatorService);
  });

  it('saves and finds a comment', async () => {
    const author = new Author(await save(createUser()));
    const thread = await save(createThread({ author }));
    const comment = createComment({ threadId: thread.id, author }, generatorService);

    await repository.save(comment);
    expect(await repository.findById(comment.id)).toEqual(comment);
  });

  it('saves and edited comment', async () => {
    const user = await save(createUser());
    const author = new Author(user);
    const thread = await save(createThread({ author }));

    const comment = createComment(
      {
        threadId: thread.id,
        author,
        message: createMessage({
          author,
          text: new Markdown('initial text'),
          date: new Timestamp('2022-01-02'),
        }),
        history: [],
      },
      generatorService,
    );

    await repository.save(comment);

    await comment.edit(new StubDateService(), user, 'edited text');
    await repository.save(comment);

    expect(await repository.findById(comment.id)).toEqual(comment);
  });

  it("finds a thread's root comments", async () => {
    const author = new Author(await save(createUser()));
    const thread = await save(createThread({ author }));
    const parent = await save(createComment({ threadId: thread.id, author }, generatorService));
    await save(createComment({ threadId: thread.id, author, parentId: parent.id }, generatorService));

    expect(await repository.findRoots(thread.id, Sort.relevance)).toEqual([parent]);
  });

  it("finds a comment's replies", async () => {
    const author = new Author(await save(createUser()));
    const thread = await save(createThread({ author }));
    const parent = await save(createComment({ threadId: thread.id, author }, generatorService));
    const reply = await save(
      createComment({ threadId: thread.id, author, parentId: parent.id }, generatorService),
    );

    expect(await repository.findReplies([parent.id])).toEqual(new Map([[parent.id, [reply]]]));
  });
});
