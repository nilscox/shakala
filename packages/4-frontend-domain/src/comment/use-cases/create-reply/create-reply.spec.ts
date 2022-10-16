import { AuthorizationErrorReason, mockReject, mockResolve } from 'shared';

import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { createAuthUser, createComment, createThread, TestStore } from '../../../test';
import { addRootCommentToThread } from '../../../thread';
import { addThread, setThreadComments } from '../../../thread/thread.actions';
import { AuthorizationError, Comment } from '../../../types';
import { addComment } from '../../comments.actions';
import { selectCommentReplies } from '../../comments.selectors';

import {
  createReply,
  selectCreateReplyError,
  selectIsReplying,
  selectIsSubmittingReply,
  selectReplyFormText,
  setIsReplying,
  setReplyFormText,
} from './create-reply';

describe('createReply', () => {
  const store = new TestStore();

  const user = createAuthUser();
  const thread = createThread();
  const parent = createComment();

  const text = 'text';
  const now = new Date('2022-01-01');
  const createdCommentId = 'replyId';

  beforeEach(() => {
    store.user = user;

    store.dispatch(addThread(thread));
    store.dispatch(addComment(parent));
    store.dispatch(setThreadComments(thread.id, [parent]));

    store.dispatch(setIsReplying(parent.id));
    store.dispatch(setReplyFormText(parent.id, text));

    store.dateGateway.setNow(now);
    store.threadGateway.createReply = mockResolve(createdCommentId);
  });

  const execute = () => {
    return store.dispatch(createReply(parent.id));
  };

  it('creates a new reply', async () => {
    const promise = execute();

    expect(store.select(selectIsSubmittingReply, parent.id)).toBe(true);
    await promise;
    expect(store.select(selectIsSubmittingReply, parent.id)).toBe(false);

    expect(store.threadGateway.createReply).toHaveBeenCalledWith(thread.id, parent.id, text);
  });

  it('adds the created comment to list of replies', async () => {
    await execute();

    const created: Comment = {
      id: createdCommentId,
      author: {
        id: user.id,
        nick: user.nick,
        profileImage: user.profileImage,
      },
      text,
      date: now.toISOString(),
      edited: false,
      history: [],
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };

    expect(store.select(selectCommentReplies, parent.id)).toInclude(created);
  });

  it('requires user authentication', async () => {
    store.user = undefined;

    await execute();

    expect(store.routerGateway.currentAuthenticationForm).not.toBeUndefined();
  });

  it('closes the reply form', async () => {
    await execute();

    expect(store.select(selectIsReplying, parent.id)).toBe(false);
  });

  it('shows a snack when the creation succeeded', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre réponse a bien été créée.');
  });

  it('clears the persisted draft reply text', async () => {
    store.storageGateway.set(DraftCommentKind.reply, parent.id, text);

    await execute();

    expect(store.storageGateway.get(DraftCommentKind.reply, parent.id)).toBeUndefined();
  });

  describe('authorization error handling', () => {
    it('shows a snack when the user is not authorized to reply to a comment', async () => {
      store.threadGateway.createReply = mockReject(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        expect.stringMatching(/répondre à un commentaire.$/),
      );
    });
  });

  describe('fallback error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.threadGateway.createReply = mockReject(error);
    });

    it('stores the error', async () => {
      await execute();

      expect(store.select(selectIsSubmittingReply, parent.id)).toBe(false);
      expect(store.select(selectCreateReplyError, parent.id)).toHaveProperty('message', error.message);
    });

    it('logs the error', async () => {
      await execute();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('shows a snack', async () => {
      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        "Une erreur s'est produite, votre réponse n'a pas été créée.",
      );
    });
  });
});

describe('setReplyFormText', () => {
  const store = new TestStore();

  const user = createAuthUser();
  const thread = createThread();
  const parent = createComment();

  const text = 'text';

  beforeEach(() => {
    store.user = user;
    store.dispatch(addThread(thread));
    store.dispatch(addComment(parent));
    store.dispatch(addRootCommentToThread(thread.id, parent));
  });

  it('stores the draft comment text', async () => {
    await store.dispatch(setReplyFormText(parent.id, text));

    expect(store.select(selectReplyFormText, parent.id)).toEqual(text);
  });

  it('persists the draft comment text', async () => {
    await store.dispatch(setReplyFormText(parent.id, text));

    expect(store.storageGateway.get(DraftCommentKind.reply, parent.id)).toEqual(text);
  });
});
