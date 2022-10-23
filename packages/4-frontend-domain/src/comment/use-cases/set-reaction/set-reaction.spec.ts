import { AuthorizationErrorReason } from 'shared';
import { mockReject, mockResolve } from 'shared/test';

import { createAuthUser, createComment, createThread, TestStore } from '../../../test';
import { addThread } from '../../../thread/thread.actions';
import { AuthorizationError, ReactionType } from '../../../types';
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
    store.user = user;
    store.dispatch(addThread(thread));
    store.dispatch(addComment(comment));
    store.threadGateway.setReaction = mockResolve();
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
    store.user = undefined;

    await execute();

    expect(store.routerGateway.currentAuthenticationForm).toBeDefined();
  });

  describe('authorization error handling', () => {
    it('shows a snack when the user is not authorized to create a root comment', async () => {
      store.threadGateway.setReaction = mockReject(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        expect.stringMatching(/annoter un commentaire.$/),
      );
    });
  });

  describe('fallback error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.threadGateway.setReaction = mockReject(error);
    });

    it('shows a snack with a fallback message', async () => {
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
