import { AuthorizationErrorReason } from 'shared';

import { selectIsAuthenticationModalOpen } from '../../../authentication';
import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { createAuthUser, createThread, TestStore } from '../../../test';
import { AuthorizationError } from '../../../types';
import { selectCreatedRootComments } from '../../lists/created-root-comments';
import { addThread } from '../../thread.actions';
import { selectCommentThreadId } from '../../thread.selectors';

import {
  createRootComment,
  selectCreateRootCommentError,
  selectCreateRootCommentFormText,
  selectIsSubmittingRootCommentForm,
  setCreateRootCommentText,
} from './create-root-comment';

describe('createRootComment', () => {
  const store = new TestStore();

  const user = createAuthUser();
  const thread = createThread();

  const text = 'text';
  const now = new Date('2022-01-01');
  const commentId = 'commentId';

  beforeEach(async () => {
    store.user = user;
    store.dispatch(addThread(thread));
    await store.dispatch(setCreateRootCommentText(thread.id, text));

    store.dateGateway.setNow(now);
    store.threadGateway.createComment.mockResolvedValue(commentId);
  });

  const execute = () => {
    return store.dispatch(createRootComment(thread.id));
  };

  it('creates a new comment', async () => {
    const promise = execute();

    expect(store.select(selectIsSubmittingRootCommentForm, thread.id)).toBe(true);
    await promise;
    expect(store.select(selectIsSubmittingRootCommentForm, thread.id)).toBe(false);

    expect(store.threadGateway.createComment).toHaveBeenCalledWith(thread.id, text);
  });

  it('adds the new comment to the list of created comments', async () => {
    await execute();

    const createdComments = store.select(selectCreatedRootComments);

    expect(createdComments).toHaveLength(1);
    expect(createdComments[0]).toEqual({
      id: commentId,
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
    });
  });

  it('adds the created comment to the thread', async () => {
    await execute();

    expect(store.select(selectCommentThreadId, commentId)).toEqual(thread.id);
  });

  it('requires user authentication', async () => {
    store.user = undefined;

    await execute();

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(true);
  });

  it('clears the message input text', async () => {
    store.dispatch(setCreateRootCommentText(thread.id, 'hello'));

    await execute();

    expect(store.select(selectCreateRootCommentFormText, thread.id)).toEqual('');
  });

  it('shows a snack when the creation succeeded', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre commentaire a bien été créé.');
  });

  it('clears the persisted draft comment text', async () => {
    store.storageGateway.set(DraftCommentKind.root, thread.id, text);

    await execute();

    expect(store.storageGateway.get(DraftCommentKind.root, thread.id)).toBeUndefined();
  });

  describe('authorization error handling', () => {
    it('shows a snack when the user is not authorized to create a root comment', async () => {
      store.threadGateway.createComment.mockRejectedValue(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        expect.stringMatching(/créer un commentaire.$/),
      );
    });
  });

  describe('fallback error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.threadGateway.createComment.mockRejectedValue(error);
    });

    it('stores the error', async () => {
      await execute();

      expect(store.select(selectIsSubmittingRootCommentForm, thread.id)).toBe(false);
      expect(store.select(selectCreateRootCommentError, thread.id)).toHaveProperty('message', error.message);
    });

    it('logs the error', async () => {
      await execute();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('shows a snack with a fallback message', async () => {
      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        "Une erreur s'est produite, votre commentaire n'a pas été créé.",
      );
    });
  });
});

describe('setCreateRootCommentText', () => {
  const store = new TestStore();

  const user = createAuthUser();
  const thread = createThread();

  const text = 'text';

  beforeEach(() => {
    store.user = user;
    store.dispatch(addThread(thread));
  });

  it('stores the draft comment text', async () => {
    await store.dispatch(setCreateRootCommentText(thread.id, text));

    expect(store.select(selectCreateRootCommentFormText, thread.id)).toEqual(text);
  });

  it('persists the draft comment text', async () => {
    await store.dispatch(setCreateRootCommentText(thread.id, text));

    expect(store.storageGateway.get(DraftCommentKind.root, thread.id)).toEqual(text);
  });
});
