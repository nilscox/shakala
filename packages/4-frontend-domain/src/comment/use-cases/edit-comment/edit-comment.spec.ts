import { selectIsAuthenticationModalOpen } from '../../../authentication';
import { setUser, unsetUser } from '../../../authentication/user.slice';
import { createAuthUser, createComment, createDate, createThread, TestStore } from '../../../test';
import { addRootCommentToThread } from '../../../thread';
import { addThread } from '../../../thread/thread.actions';
import { AuthorizationError } from '../../../types';
import { addComment } from '../../comments.actions';
import { selectComment } from '../../comments.selectors';

import {
  editComment,
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

  const commentId = 'commentId';
  const created = createDate('2022-01-01');
  const comment = createComment({ id: commentId, text: 'text', date: created });

  const threadId = 'threadId';
  const thread = createThread({ id: threadId, comments: [comment] });

  const text = 'updated';
  const now = new Date('2022-01-02');

  beforeEach(() => {
    store.dispatch(setUser({ user }));
    store.dispatch(addThread(thread));
    store.dispatch(addComment(comment));
    store.dispatch(setIsEditingComment(commentId));

    store.dateGateway.setNow(now);
  });

  const execute = () => {
    return store.dispatch(editComment(commentId));
  };

  it("initializes the edition form text with the comment's text", () => {
    expect(store.select(selectEditCommentFormText, commentId)).toEqual(comment.text);
  });

  it('updates an existing comment', async () => {
    store.dispatch(setEditCommentFormText(commentId, text));

    const promise = execute();

    expect(store.select(selectIsSubmittingCommentEditionForm, commentId)).toBe(true);
    await promise;
    expect(store.select(selectIsSubmittingCommentEditionForm, commentId)).toBe(false);

    expect(store.threadGateway.editComment).toHaveBeenCalledWith(commentId, text);
  });

  it('updates the comment text and edition date', async () => {
    store.dispatch(setEditCommentFormText(commentId, text));

    await execute();

    const comment = store.select(selectComment, commentId);

    expect(comment).toHaveProperty('text', text);
    expect(comment).toHaveProperty('edited', now.toISOString());
  });

  it("adds the old text to the comment's history", async () => {
    store.dispatch(setEditCommentFormText(commentId, text));

    await execute();

    expect(store.select(selectComment, commentId)).toHaveProperty('history', [
      { date: created, text: comment.text },
    ]);
  });

  it('requires user authentication', async () => {
    store.dispatch(unsetUser());

    await execute();

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(true);
  });

  it('closes the edition form', async () => {
    await execute();

    expect(store.select(selectIsEditingComment, commentId)).toBe(false);
  });

  it('shows a snack when the edition succeeded', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre commentaire a bien été mis à jour.');
  });

  it('clears the persisted draft comment edition text', async () => {
    store.storageGateway.set('edition', commentId, text);

    await execute();

    expect(store.storageGateway.get('edition', commentId)).toBeUndefined();
  });

  describe('error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.threadGateway.editComment.mockRejectedValue(error);
    });

    it('stores the error', async () => {
      await execute();

      expect(store.select(selectIsSubmittingCommentEditionForm, commentId)).toBe(false);
      expect(store.select(selectEditCommentError, commentId)).toHaveProperty('message', error.message);
    });

    it('logs the error', async () => {
      await execute();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('shows a snack', async () => {
      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        "Une erreur s'est produite, votre commentaire n'a pas été mis à jour.",
      );
    });

    it("shows an error when the user tries to edit someone else's comment", async () => {
      store.threadGateway.editComment.mockRejectedValue(new AuthorizationError('UserMustBeAuthor'));

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

  const threadId = 'threadId';
  const thread = createThread({ id: threadId });

  const commentId = 'commentId';
  const comment = createComment({ id: commentId, text: 'text' });

  const text = 'edit';

  beforeEach(() => {
    store.dispatch(setUser({ user }));
    store.dispatch(addThread(thread));
    store.dispatch(addComment(comment));
    store.dispatch(addRootCommentToThread(threadId, comment));
  });

  it('stores the draft edited text', async () => {
    await store.dispatch(setEditCommentFormText(commentId, text));

    expect(store.select(selectEditCommentFormText, commentId)).toEqual(text);
  });

  it('persists the draft edited text', async () => {
    await store.dispatch(setEditCommentFormText(commentId, text));

    expect(store.storageGateway.get('edition', commentId)).toEqual(text);
  });
});
