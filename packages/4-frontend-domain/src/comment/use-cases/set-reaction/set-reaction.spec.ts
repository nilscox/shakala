import { selectIsAuthenticationModalOpen } from '../../../authentication';
import { setUser, unsetUser } from '../../../authentication/user.slice';
import { createAuthUser, createComment, createThread, TestStore } from '../../../test';
import { addThread } from '../../../thread/thread.actions';
import { ReactionType } from '../../../types';
import { addComment } from '../../comments.actions';
import { selectComment } from '../../comments.selectors';

import { setReaction, setUserReaction } from './set-reaction';

describe('setReaction', () => {
  const store = new TestStore();

  const user = createAuthUser();

  const commentId = 'commentId';
  const comment = createComment({
    id: commentId,
    text: 'text',
    upvotes: 3,
    downvotes: 1,
    userReaction: undefined,
  });

  const threadId = 'threadId';
  const thread = createThread({ id: threadId, comments: [comment] });

  beforeEach(() => {
    store.dispatch(setUser({ user }));
    store.dispatch(addThread(thread));
    store.dispatch(addComment(comment));
  });

  const execute = async (reactionType = ReactionType.upvote) => {
    await store.dispatch(setReaction(commentId, reactionType));
  };

  it('sets a reaction on a comment', async () => {
    await execute(ReactionType.upvote);

    expect(store.threadGateway.setReaction).toHaveBeenCalledWith(commentId, ReactionType.upvote);
  });

  describe('add reaction', () => {
    it("updates the user's reaction", async () => {
      await execute(ReactionType.upvote);

      expect(store.select(selectComment, commentId)).toHaveProperty('userReaction', ReactionType.upvote);
    });

    it("updates the comment's reactions counts", async () => {
      await execute(ReactionType.upvote);

      expect(store.select(selectComment, commentId)).toHaveProperty('upvotes', 4);
      expect(store.select(selectComment, commentId)).toHaveProperty('downvotes', 1);
    });
  });

  describe('update reaction', () => {
    beforeEach(() => {
      store.dispatch(setUserReaction(commentId, ReactionType.upvote));
    });

    it("updates the user's reaction", async () => {
      await execute(ReactionType.downvote);

      expect(store.select(selectComment, commentId)).toHaveProperty('userReaction', ReactionType.downvote);
    });

    it("updates the comment's reactions counts", async () => {
      await execute(ReactionType.downvote);

      expect(store.select(selectComment, commentId)).toHaveProperty('upvotes', 2);
      expect(store.select(selectComment, commentId)).toHaveProperty('downvotes', 2);
    });
  });

  describe('unset reaction', () => {
    beforeEach(() => {
      store.dispatch(setUserReaction(commentId, ReactionType.upvote));
    });

    it("updates the user's reaction", async () => {
      await execute(ReactionType.upvote);

      expect(store.select(selectComment, commentId)).toHaveProperty('userReaction', undefined);
    });

    it("updates the comment's reactions counts", async () => {
      await execute(ReactionType.upvote);

      expect(store.select(selectComment, commentId)).toHaveProperty('upvotes', 2);
      expect(store.select(selectComment, commentId)).toHaveProperty('downvotes', 1);
    });
  });

  it('requires user authentication', async () => {
    store.dispatch(unsetUser());

    await execute();

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(true);
  });

  describe('error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.threadGateway.setReaction.mockRejectedValue(error);
    });

    it('shows a snack', async () => {
      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        "Une erreur s'est produite, votre action n'a pas été comptabilisée.",
      );
    });

    it('rollbacks to the previous value', async () => {
      await execute();

      expect(store.select(selectComment, commentId)).toEqual(comment);
    });
  });
});
