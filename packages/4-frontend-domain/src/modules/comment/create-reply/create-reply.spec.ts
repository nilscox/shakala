import { AuthorizationErrorReason } from 'shared';

import { createTestStore, TestStore } from '../../../test-store';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationSelectors } from '../../authentication';
import { AuthorizationError } from '../../authorization';
import { createThread, Thread, threadActions } from '../../thread';
import { AuthUser, createAuthUser } from '../../user-account';
import { commentActions } from '../comment.actions';
import { commentSelectors } from '../comment.selectors';
import { Comment, createComment, createReply as createReplyFactory, Reply } from '../comment.types';

describe('createReply', () => {
  let store: TestStore;

  let user: AuthUser;
  let thread: Thread;
  let parent: Comment;

  beforeEach(async () => {
    store = createTestStore();

    user = createAuthUser();
    store.user = user;

    parent = createComment({ id: 'parentId' });
    thread = createThread({ comments: [parent] });

    store.dispatch(threadActions.setThread(thread));
    store.dispatch(commentActions.setReplying(parent.id, true));

    store.commentGateway.createReply.resolve('replyId');
    store.dateGateway.setNow(new Date('2022-01-01'));
  });

  const createReply = (text = 'reply') => {
    return store.dispatch(commentActions.createReply(parent.id, text));
  };

  const getDraftReply = () => {
    return store.draftsGateway.getDraft('reply', thread.id, parent.id);
  };

  const setDraftReply = (text: string) => {
    return store.draftsGateway.setDraft('reply', thread.id, parent.id, text);
  };

  it('creates a new reply to a comment', async () => {
    await expect.async(createReply()).toBe(true);

    const created: Reply = {
      id: 'replyId',
      author: {
        id: user.id,
        nick: user.nick,
        profileImage: user.profileImage,
      },
      date: new Date('2022-01-01').toISOString(),
      edited: false,
      text: 'reply',
      history: [],
      upvotes: 0,
      downvotes: 0,
      editing: false,
    };

    expect(store.select(commentSelectors.byId, parent.id)).toHaveProperty('replies', [created]);
  });

  it('trims the given text', async () => {
    await createReply(' reply  ');

    expect(store.commentGateway.createReply.lastCall).toHaveProperty('1', 'reply');
    expect(store.select(commentSelectors.byId, 'replyId')).toHaveProperty('text', 'reply');
  });

  it('requires user authentication', async () => {
    store.user = null;

    await expect.async(createReply()).toBe(false);

    expect(store.select(authenticationSelectors.isModalOpen)).toBe(true);
  });

  it('closes the reply form', async () => {
    await createReply();

    expect(store.select(commentSelectors.isReplying, parent.id)).toBe(false);
  });

  it('shows a snack when the edition succeeded', async () => {
    await createReply();

    expect(store.snackbarGateway).toHaveSnack('success', 'Votre réponse a bien été créée.');
  });

  it('clears the persisted draft reply text', async () => {
    await setDraftReply('text');

    await createReply();

    expect(await getDraftReply()).toBe(undefined);
  });

  it('does not allow replying to a reply', () => {
    const reply = createReplyFactory();
    const parent = createComment({ replies: [reply] });

    store.dispatch(commentActions.addComment(parent));

    expect(store.select(commentSelectors.canReply, parent.id)).toBe(true);
    expect(store.select(commentSelectors.canReply, reply.id)).toBe(false);
  });

  describe('authorization error handling', () => {
    it('shows a snack when the user is not authorized to reply to a comment', async () => {
      store.commentGateway.createReply.reject(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await createReply();

      expect(store.snackbarGateway).toHaveSnack(
        'error',
        expect.stringMatching(/répondre à un commentaire.$/),
      );
    });
  });

  describe('error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.commentGateway.createReply.reject(error);
    });

    it('throws the validation errors', async () => {
      const error = new ValidationErrors({});

      store.commentGateway.createReply.reject(error);

      await expect.rejects(createReply()).with(error);
    });

    it('logs the unhandled errors', async () => {
      await createReply();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('returns false when the reply creation failed', async () => {
      store.commentGateway.createReply.reject(new Error('nope.'));

      await expect.async(createReply()).toBe(false);
    });

    it('shows a fallback message to inform that the reply was not created', async () => {
      await createReply();

      expect(store.snackbarGateway).toHaveSnack(
        'error',
        "Une erreur s'est produite, votre réponse n'a pas été créée.",
      );
    });
  });

  describe('getInitialReplyText', () => {
    let draft: string | undefined = undefined;

    beforeEach(() => {
      draft = undefined;
    });

    const setDraft = (text: string) => {
      draft = text;
    };

    it('returns an empty string when the reply has no draft', async () => {
      await store.dispatch(commentActions.getInitialReplyText(parent.id, setDraft));

      expect(draft).toEqual('');
    });

    it('returns the existing draft reply text', async () => {
      await setDraftReply('draft');

      await store.dispatch(commentActions.getInitialReplyText(parent.id, setDraft));

      expect(draft).toEqual('draft');
    });
  });

  describe('saveDraftReply', () => {
    it("stores a draft reply's text", async () => {
      await store.dispatch(commentActions.saveDraftReply(parent.id, 'draft'));

      expect(await getDraftReply()).toEqual('draft');
    });
  });

  describe('closeReplyForm', () => {
    it('sets the replying flag to false when closing the reply form', async () => {
      await store.dispatch(commentActions.closeReplyForm(parent.id));

      expect(await store.select(commentSelectors.isReplying, parent.id)).toBe(false);
    });

    it('clear the persisted draft reply text', async () => {
      await store.dispatch(commentActions.closeReplyForm(parent.id));

      expect(await getDraftReply()).toBe(undefined);
    });
  });
});
