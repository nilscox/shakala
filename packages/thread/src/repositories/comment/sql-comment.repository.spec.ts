import expect from '@nilscox/expect';
import { SqlComment, SqlThread } from '@shakala/persistence/src';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence/test';
import { CommentSort, createFactory, first, ReactionType } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';
import { GetCommentResult } from '../../queries/get-comment';

import { SqlCommentRepository } from './sql-comment.repository';

describe('SqlCommentRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('saves and finds a comment entity', async () => {
    const user = await test.create.user();
    const { thread } = await test.createThread();

    const comment = create.comment({
      authorId: user.id,
      threadId: thread.id,
      messages: [create.message({ text: create.markdown('comment') })],
    });

    const reply = create.comment({
      authorId: user.id,
      threadId: thread.id,
      parentId: comment.id,
      messages: [create.message({ text: create.markdown('reply') })],
    });

    await test.repository.save(comment);
    await test.repository.save(reply);

    await expect(test.repository.findById(comment.id)).toResolve(comment);
    await expect(test.repository.findById(reply.id)).toResolve(reply);
  });

  describe('findComment', () => {
    const createCommentQueryResult = createFactory<GetCommentResult>(() => ({
      id: 'commentId',
      threadId: 'threadId',
      author: {
        id: 'authorId',
        nick: 'nick',
        profileImage: '/user/authorId/profile-image',
      },
      text: 'text',
      date: test.now,
      edited: false,
      history: [],
      upvotes: 0,
      downvotes: 0,
      isSubscribed: undefined,
      userReaction: undefined,
      replies: [],
    }));

    it('retrieves a comment from its id', async () => {
      const { thread } = await test.createThread({ id: 'threadId' });
      await test.createComment({ thread });

      const expected = createCommentQueryResult();

      expect(await test.repository.findComment('commentId')).toEqual(expected);
    });

    it('retrieves an edited comment', async () => {
      const { thread } = await test.createThread({ id: 'threadId' });
      const { comment } = await test.createComment({ thread });

      await test.create.message({ text: 'edit', comment, createdAt: test.now2 });

      const expected = createCommentQueryResult({
        text: 'edit',
        edited: test.now2,
        history: [{ date: test.now, text: 'text' }],
      });

      expect(await test.repository.findComment('commentId')).toEqual(expected);
    });

    it("includes information from the user's context", async () => {
      const user = await test.create.user();

      const { thread, author } = await test.createThread();
      const { comment: parent } = await test.createComment({ id: 'parentId', thread, author });
      const { comment: reply } = await test.createComment({ id: 'replyId', thread, author, parent });

      await test.create.reaction({ comment: parent, user, type: ReactionType.upvote });
      await test.create.commentSubscription({ comment: parent, user });

      await test.create.reaction({ comment: reply, user, type: ReactionType.downvote });
      await test.create.commentSubscription({ comment: reply, user });

      const result = await test.repository.findComment(parent.id, user.id);

      expect(result).toHaveProperty('upvotes', 1);
      expect(result).toHaveProperty('userReaction', ReactionType.upvote);
      expect(result).toHaveProperty('replies.0.userReaction', ReactionType.downvote);

      expect(result).toHaveProperty('isSubscribed', true);
      expect(result).toHaveProperty('replies.0.isSubscribed', true);
    });

    it('filters out hidden comments', async () => {
      const { thread, author } = await test.createThread();
      const { comment } = await test.createComment({ id: 'parentId', thread, author, hidden: true });

      expect(await test.repository.findComment(comment.id)).toBeUndefined();
    });
  });

  describe('findThreadComments', () => {
    it("retrieves a thread's comments from its id", async () => {
      expect(await test.repository.findThreadComments('threadId', { sort: CommentSort.dateAsc })).toEqual([]);
    });

    it("retrieves a thread's comments sorted by date asc", async () => {
      const { thread } = await test.createThread();
      const { comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      const results = await test.repository.findThreadComments(thread.id, { sort: CommentSort.dateAsc });

      expect(results).toHaveLength(2);
      expect(results).toHaveProperty('0.id', comment1.id);
      expect(results).toHaveProperty('1.id', comment2.id);

      expect(first(results)?.replies).toHaveLength(2);
      expect(results).toHaveProperty('0.replies.0.id', reply1.id);
      expect(results).toHaveProperty('0.replies.1.id', reply2.id);
    });

    it("retrieves a thread's comments sorted by date desc", async () => {
      const { thread } = await test.createThread();
      const { comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      const results = await test.repository.findThreadComments(thread.id, { sort: CommentSort.dateDesc });

      expect(results).toHaveProperty('0.id', comment2.id);
      expect(results).toHaveProperty('1.id', comment1.id);

      expect(results).toHaveProperty('1.replies.0.id', reply1.id);
      expect(results).toHaveProperty('1.replies.1.id', reply2.id);
    });

    it("retrieves a thread's comments matching a search query", async () => {
      const { thread } = await test.createThread();
      const { comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      await test.create.message([
        { comment: comment1, text: 'match' },
        { comment: comment2, text: 'nope' },
        { comment: reply1, text: 'match' },
        { comment: reply2, text: 'nope' },
      ]);

      const results = await test.repository.findThreadComments(thread.id, {
        sort: CommentSort.dateAsc,
        search: 'match',
      });

      expect(results).toHaveLength(1);
      expect(results).toHaveProperty('0.id', comment1.id);

      expect(first(results)?.replies).toHaveLength(1);
      expect(results).toHaveProperty('0.replies.0.id', reply1.id);
    });
  });
});

class Test extends RepositoryTest {
  now = new Date('2022-01-01').toISOString();
  now2 = new Date('2022-01-02').toISOString();

  get repository() {
    return new SqlCommentRepository(this.database);
  }

  async createThread(overrides?: Partial<SqlThread>) {
    const author = await this.create.user();
    const thread = await this.create.thread({ author, ...overrides });

    return { author, thread };
  }

  async createComment(overrides?: Partial<SqlComment>) {
    const author = overrides?.author ?? (await this.create.user({ id: 'authorId', nick: 'nick' }));
    const comment = await this.create.comment({ id: 'commentId', author, createdAt: this.now, ...overrides });
    await this.create.message({ comment, text: 'text', createdAt: this.now });

    return { author, comment };
  }

  async createComments(thread: SqlThread) {
    const author = await this.create.user();

    const reply1 = await this.create.comment({ thread, author });
    const reply2 = await this.create.comment({ thread, author });
    const comment1 = await this.create.comment({ thread, author, replies: [reply1, reply2] });
    const comment2 = await this.create.comment({ thread, author });

    await this.create.message([
      { comment: comment1 },
      { comment: comment2 },
      { comment: reply1 },
      { comment: reply2 },
    ]);

    return { author, comment1, comment2, reply1, reply2 };
  }
}
