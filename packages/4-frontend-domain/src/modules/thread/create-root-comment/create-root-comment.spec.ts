import { AuthorizationErrorReason } from 'shared';

import { DraftCommentKind } from '../../../gateways/draft-messages.gateway';
import { createTestStore, TestStore } from '../../../test-store';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationSelectors } from '../../authentication';
import { AuthorizationError } from '../../authorization';
import { AuthUser, createAuthUser } from '../../user-account';
import { threadActions } from '../thread.actions';
import { threadSelectors } from '../thread.selectors';
import { createThread, Thread } from '../thread.types';

describe('createRootComment', () => {
  let store: TestStore;

  let user: AuthUser;
  let thread: Thread;

  beforeEach(async () => {
    store = createTestStore();

    user = createAuthUser();
    store.user = user;

    thread = createThread();
    store.dispatch(threadActions.setThread(thread));

    store.threadGateway.createComment.resolve('commentId');
    store.dateGateway.setNow(new Date('2022-01-01'));
  });

  const createComment = (text = 'text') => {
    return store.dispatch(threadActions.createRootComment(thread.id, text));
  };

  const getDraftComment = () => {
    return store.draftMessagesGateway.getDraftCommentText(DraftCommentKind.root, thread.id);
  };

  const setDraftComment = (text: string) => {
    return store.draftMessagesGateway.setDraftCommentText(DraftCommentKind.root, thread.id, text);
  };

  it('creates a new comment on a thread', async () => {
    await expect.async(createComment()).toBe(true);

    expect(store.select(threadSelectors.byId, thread.id)).toHaveProperty('comments.0', {
      id: 'commentId',
      author: {
        id: user.id,
        nick: user.nick,
        profileImage: user.profileImage,
      },
      date: new Date('2022-01-01').toISOString(),
      edited: false,
      text: 'text',
      history: [],
      upvotes: 0,
      downvotes: 0,
      replies: [],
      replying: false,
      editing: false,
    });
  });

  it('requires user authentication', async () => {
    store.user = null;

    await expect.async(createComment()).toBe(false);

    expect(store.select(authenticationSelectors.isModalOpen)).toBe(true);
  });

  it('shows a snack when the creation succeeded', async () => {
    await createComment();

    expect(store.snackbarGateway).toHaveSuccessMessage('Votre commentaire a bien été créé.');
  });

  it('clears the persisted draft comment text', async () => {
    await setDraftComment('text');

    await createComment();

    expect(await getDraftComment()).toBe(undefined);
  });

  describe('error handling', () => {
    it('shows a snack when the user is not authorized to create a comment', async () => {
      store.threadGateway.createComment.reject(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await createComment();

      expect(store.snackbarGateway).toHaveErrorMessage(expect.stringMatching(/créer un commentaire.$/));
    });

    it('throws validation errors', async () => {
      const error = new ValidationErrors({});

      store.threadGateway.createComment.reject(error);

      await expect.rejects(createComment()).with(error);
    });

    it('returns false when the comment creation failed', async () => {
      store.threadGateway.createComment.reject(new Error('nope.'));

      await expect.async(createComment()).toBe(false);
    });

    it('logs unhandled errors', async () => {
      const error = new Error('nope.');

      store.threadGateway.createComment.reject(error);

      await createComment();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('displays a fallback message to inform that the comment was not created', async () => {
      store.threadGateway.createComment.reject(new Error('nope.'));

      await createComment();

      expect(store.snackbarGateway).toHaveErrorMessage(
        "Une erreur s'est produite, votre commentaire n'a pas été créé.",
      );
    });
  });
});
