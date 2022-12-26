import { AuthorizationError, AuthorizationErrorReason } from 'shared';

import { StubCommentGateway } from '../../../stubs/stub-comment-gateway';
import { createTestStore, TestStore } from '../../../test-store';
import { authenticationSelectors } from '../../authentication';
import { createThread, threadActions } from '../../thread';
import { createAuthUser } from '../../user-account';
import { commentActions } from '../comment.actions';
import { commentSelectors } from '../comment.selectors';
import { createComment, ReactionType } from '../comment.types';

import { setReaction } from './set-reaction';

const { byId } = commentSelectors;

describe('setReaction', () => {
  let store: TestStore;
  let commentGateway: StubCommentGateway;

  beforeEach(() => {
    store = createTestStore();
    commentGateway = store.commentGateway;

    store.user = createAuthUser();

    const comment = createComment({
      id: 'commentId',
      text: 'text',
      upvotes: 3,
      downvotes: 1,
      userReaction: undefined,
    });

    const thread = createThread({ id: 'threadId', comments: [comment] });

    store.dispatch(threadActions.setThread(thread));

    commentGateway.setReaction.resolve();
  });

  const execute = async (reactionType = ReactionType.upvote) => {
    await store.dispatch(setReaction('commentId', reactionType));
  };

  it('sets a reaction on a comment', async () => {
    await execute(ReactionType.upvote);

    expect(commentGateway.setReaction.lastCall).toEqual(['commentId', ReactionType.upvote]);
  });

  describe('add reaction', () => {
    it("updates the user's reaction", async () => {
      await execute(ReactionType.upvote);

      expect(store.select(byId, 'commentId')).toHaveProperty('userReaction', ReactionType.upvote);
    });

    it("updates the comment's reactions counts", async () => {
      await execute(ReactionType.upvote);

      expect(store.select(byId, 'commentId')).toHaveProperty('upvotes', 4);
      expect(store.select(byId, 'commentId')).toHaveProperty('downvotes', 1);
    });
  });

  describe('update reaction', () => {
    beforeEach(() => {
      store.dispatch(commentActions.setUserReaction('commentId', ReactionType.upvote));
    });

    it("updates the user's reaction", async () => {
      await execute(ReactionType.downvote);

      expect(store.select(byId, 'commentId')).toHaveProperty('userReaction', ReactionType.downvote);
    });

    it("updates the comment's reactions counts", async () => {
      await execute(ReactionType.downvote);

      expect(store.select(byId, 'commentId')).toHaveProperty('upvotes', 2);
      expect(store.select(byId, 'commentId')).toHaveProperty('downvotes', 2);
    });
  });

  describe('unset reaction', () => {
    beforeEach(() => {
      store.dispatch(commentActions.setUserReaction('commentId', ReactionType.upvote));
    });

    it("updates the user's reaction", async () => {
      await execute(ReactionType.upvote);

      expect(store.select(byId, 'commentId')).not.toHaveProperty('userReaction');
    });

    it("updates the comment's reactions counts", async () => {
      await execute(ReactionType.upvote);

      expect(store.select(byId, 'commentId')).toHaveProperty('upvotes', 2);
      expect(store.select(byId, 'commentId')).toHaveProperty('downvotes', 1);
    });
  });

  it('requires user authentication', async () => {
    store.user = null;

    await execute();

    expect(store.select(authenticationSelectors.isModalOpen)).toBe(true);
  });

  describe('authorization error handling', () => {
    it('shows a snack when the user is not authorized to create a root comment', async () => {
      commentGateway.setReaction.reject(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await execute();

      expect(store.snackbarGateway).toHaveSnack('error', expect.stringMatching(/annoter un commentaire.$/));
    });
  });

  describe('fallback error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      commentGateway.setReaction.reject(error);
    });

    it('shows a snack with a fallback message', async () => {
      await execute();

      expect(store.snackbarGateway).toHaveSnack(
        'error',
        "Une erreur s'est produite, votre action n'a pas été comptabilisée.",
      );
    });

    it('logs the error', async () => {
      await execute();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('rollbacks to the previous value', async () => {
      const comment = store.select(byId, 'commentId');

      await execute();

      expect(store.select(byId, 'commentId')).toEqual(comment);
    });
  });
});
