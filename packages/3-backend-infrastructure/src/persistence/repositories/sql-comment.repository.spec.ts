import { Sort } from '@shakala/backend-application';
import { createDomainDependencies, factories, ReactionType } from '@shakala/backend-domain';
import { ReactionTypeDto } from '@shakala/shared';

import { MathRandomGeneratorAdapter } from '../../infrastructure';
import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlCommentRepository } from './sql-comment.repository';

describe('SqlCommentRepository', () => {
  let repository: SqlCommentRepository;

  const generator = new MathRandomGeneratorAdapter();

  const deps = createDomainDependencies({ generator });
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
    comment.clearEvents();

    await repository.save(comment);

    expect(await repository.findById(comment.id)).toEqual(comment);
  });

  describe('findThreadComments', () => {
    it("retrieves a thread's root comments", async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));
      const comment1 = await save(create.comment({ threadId: thread.id, author }));
      const comment2 = await save(create.comment({ threadId: thread.id, author }));

      const comments = await repository.findThreadComments(thread.id, Sort.dateAsc);

      expect(comments).toHaveLength(2);

      expect(comments).toEqual([
        expect.objectWith({ id: comment1.id }),
        expect.objectWith({ id: comment2.id }),
      ]);

      expect(comments[0]).toEqual({
        id: comment1.id,
        author: {
          id: author.id,
          nick: author.nick.toString(),
          profileImage: author.profileImage?.toString(),
        },
        text: comment1.message.toString(),
        date: expect.any(String),
        edited: false,
        history: [],
        upvotes: 0,
        downvotes: 0,
        userReaction: undefined,
        isSubscribed: undefined,
        replies: [],
      });
    });

    it("retrieves a thread's comments sorted by date desc", async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));
      const comment1 = await save(create.comment({ threadId: thread.id, author }));
      const comment2 = await save(create.comment({ threadId: thread.id, author }));

      const comments = await repository.findThreadComments(thread.id, Sort.dateDesc);

      expect(comments).toHaveLength(2);

      expect(comments).toEqual([
        expect.objectWith({ id: comment2.id }),
        expect.objectWith({ id: comment1.id }),
      ]);
    });

    it("retrieves a thread's comments matching a search query", async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));

      const createComment = (message = 'nope', parentId?: string) => {
        return create.comment({
          threadId: thread.id,
          author,
          parentId,
          message: create.message({ text: create.markdown(message) }),
        });
      };

      const matchingRootComment = await save(createComment('match'));
      const nonMatchingParent = await save(createComment());
      await save(createComment('match reply', nonMatchingParent.id));
      await save(createComment());

      const results = await repository.findThreadComments(thread.id, Sort.dateAsc, 'match');

      expect(results).toEqual([
        expect.objectWith({ id: matchingRootComment.id }),
        expect.objectWith({ id: nonMatchingParent.id }),
      ]);
    });

    it("retrieves the comments' history", async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));

      const comment = await save(
        create.comment({
          threadId: thread.id,
          author,
          message: create.message({ date: create.timestamp('2022-01-02'), text: create.markdown('edition') }),
          history: [create.message({ date: create.timestamp('2022-01-01'), text: create.markdown('text') })],
        }),
      );

      const comments = await repository.findThreadComments(thread.id, Sort.dateAsc);

      expect(comments).toHaveLength(1);
      expect(comments[0]).toEqual(
        expect.objectWith({
          id: comment.id,
          edited: new Date('2022-01-02').toISOString(),
          history: [{ date: new Date('2022-01-01').toISOString(), text: 'text' }],
          text: 'edition',
        }),
      );
    });

    it("retrieves the comments' replies", async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));
      const comment = await save(create.comment({ threadId: thread.id, author }));
      const reply = await save(create.comment({ threadId: thread.id, author, parentId: comment.id }));

      expect(await repository.findThreadComments(thread.id, Sort.dateAsc)).toHaveProperty('0.replies', [
        expect.objectWith({ id: reply.id }),
      ]);
    });

    it("retrieves comments' reactions", async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));
      const comment = await save(create.comment({ threadId: thread.id, author }));

      const user1 = await save(create.user());
      const user2 = await save(create.user());

      await save(create.reaction({ userId: user1.id, commentId: comment.id, type: ReactionType.upvote }));
      await save(create.reaction({ userId: user2.id, commentId: comment.id, type: ReactionType.downvote }));

      expect(await repository.findThreadComments(thread.id, Sort.dateAsc)).toEqual([
        expect.objectWith({
          upvotes: 1,
          downvotes: 1,
        }),
      ]);
    });

    it('retrieves user specific information', async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));
      const comment = await save(create.comment({ threadId: thread.id, author }));

      const user = await save(create.user());
      await save(create.reaction({ commentId: comment.id, userId: user.id, type: ReactionType.upvote }));
      await save(create.commentSubscription({ commentId: comment.id, userId: user.id }));

      const result = await repository.findThreadComments(thread.id, Sort.dateAsc, undefined, user.id);

      expect(result).toHaveProperty('0.userReaction', ReactionTypeDto.upvote);
      expect(result).toHaveProperty('0.isSubscribed', true);
    });
  });
});
