import { AuthorizationErrorReason } from 'shared';
import { mockReject, mockResolve } from 'shared/test';

import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { createAuthUser, createComment, createDate, createThread, TestStore } from '../../../test';
import { addRootCommentToThread } from '../../../thread';
import { addThread } from '../../../thread/thread.actions';
import { AuthorizationError } from '../../../types';
import { addComment } from '../../comments.actions';
import { selectComment } from '../../comments.selectors';

import {
  editComment,
  selectCanSubmitEditCommentForm,
  selectEditCommentError,
  selectEditCommentFormText,
  selectIsEditingComment,
  selectIsSubmittingCommentEditionForm,
  setEditCommentFormText,
  setIsEditingComment,
} from './edit-comment';

describe('editComment', () => {
  const store = new TestStore();

  const user = createAuthUser();
  const created = createDate('2022-01-01');
  const comment = createComment({ text: 'text', date: created });
  const thread = createThread({ comments: [comment] });

  const text = 'updated';
  const now = new Date('2022-01-02');

  beforeEach(() => {
    store.user = user;
    store.dispatch(addThread(thread));
    store.dispatch(addComment(comment));
    store.dispatch(setIsEditingComment(comment.id, true));

    store.dateGateway.setNow(now);
    store.threadGateway.editComment = mockResolve();
  });

  const execute = () => {
    return store.dispatch(editComment(comment.id));
  };

  it("initializes the edition form text with the comment's text", () => {
    expect(store.select(selectEditCommentFormText, comment.id)).toEqual(comment.text);
  });

  it('updates an existing comment', async () => {
    store.dispatch(setEditCommentFormText(comment.id, text));

    const promise = execute();

    expect(store.select(selectIsSubmittingCommentEditionForm, comment.id)).toBe(true);
    await promise;
    expect(store.select(selectIsSubmittingCommentEditionForm, comment.id)).toBe(false);

    expect(store.threadGateway.editComment).toHaveBeenCalledWith(comment.id, text);
  });

  it('updates the comment text and edition date', async () => {
    store.dispatch(setEditCommentFormText(comment.id, text));

    await execute();

    const result = store.select(selectComment, comment.id);

    expect(result).toHaveProperty('text', text);
    expect(result).toHaveProperty('edited', now.toISOString());
  });

  it("adds the old text to the comment's history", async () => {
    store.dispatch(setEditCommentFormText(comment.id, text));

    await execute();

    expect(store.select(selectComment, comment.id)).toHaveProperty('history', [
      { date: created, text: comment.text },
    ]);
  });

  it('requires user authentication', async () => {
    store.user = undefined;

    await execute();

    expect(store.routerGateway.currentAuthenticationForm).toBeDefined();
  });

  it('closes the edition form', async () => {
    await execute();

    expect(store.select(selectIsEditingComment, comment.id)).toBe(false);
  });

  it('shows a snack when the edition succeeded', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre commentaire a bien été mis à jour.');
  });

  it('clears the persisted draft comment edition text', async () => {
    store.storageGateway.set(DraftCommentKind.edition, comment.id, text);

    await execute();

    expect(store.storageGateway.get(DraftCommentKind.edition, comment.id)).toBe(undefined);
  });

  describe('selectCanSubmitEditCommentForm', () => {
    it('allows to submit the edition form', () => {
      store.dispatch(setEditCommentFormText(comment.id, 'hello!'));

      expect(store.select(selectCanSubmitEditCommentForm, comment.id)).toBe(true);
    });

    it('prevents submitting the edition form when the text is empty', () => {
      store.dispatch(setEditCommentFormText(comment.id, ''));

      expect(store.select(selectCanSubmitEditCommentForm, comment.id)).toBe(false);
    });

    it('prevents submitting the edition form when the text was not edited', () => {
      store.dispatch(setEditCommentFormText(comment.id, comment.text));

      expect(store.select(selectCanSubmitEditCommentForm, comment.id)).toBe(false);
    });
  });

  describe('authorization error handling', () => {
    it('shows a snack when the user is not authorized to edit a comment', async () => {
      store.threadGateway.editComment = mockReject(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        expect.stringMatching(/éditer un commentaire.$/),
      );
    });
  });

  describe('fallback error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.threadGateway.editComment = mockReject(error);
    });

    it('stores the error', async () => {
      await execute();

      expect(store.select(selectIsSubmittingCommentEditionForm, comment.id)).toBe(false);
      expect(store.select(selectEditCommentError, comment.id)).toEqual(error.message);
    });

    it('logs the error', async () => {
      await execute();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('shows a snack with a fallback message', async () => {
      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        "Une erreur s'est produite, votre commentaire n'a pas été mis à jour.",
      );
    });

    it("shows an error when the user tries to edit someone else's comment", async () => {
      store.threadGateway.editComment = mockReject(new AuthorizationError('UserMustBeAuthor'));

      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        "Vous devez être l'auteur du message pour pouvoir l'éditer.",
      );
    });
  });
});

describe('setEditCommentFormText', () => {
  const store = new TestStore();

  const user = createAuthUser();
  const thread = createThread();
  const comment = createComment({ text: 'text' });

  const text = 'edit';

  beforeEach(() => {
    store.user = user;
    store.dispatch(addThread(thread));
    store.dispatch(addComment(comment));
    store.dispatch(addRootCommentToThread(thread.id, comment));
  });

  it('stores the draft edited text', async () => {
    await store.dispatch(setEditCommentFormText(comment.id, text));

    expect(store.select(selectEditCommentFormText, comment.id)).toEqual(text);
  });

  it('persists the draft edited text', async () => {
    await store.dispatch(setEditCommentFormText(comment.id, text));

    expect(store.storageGateway.get(DraftCommentKind.edition, comment.id)).toEqual(text);
  });
});
