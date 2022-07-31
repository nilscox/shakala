import { selectIsAuthenticationModalOpen } from '../../../authentication';
import { setUser, unsetUser } from '../../../authentication/user.slice';
import { createAuthUser, createComment, createThread, TestStore } from '../../../test';
import { addThread } from '../../../thread/thread.actions';
import { AuthorizationError } from '../../../types';
import { addComments } from '../../comments.actions';
import { selectComment } from '../../comments.selectors';

import {
  editComment,
  selectEditCommentFormText,
  selectIsSubmittingCommentEditionForm,
  setEditCommentFormText,
  setIsEditingComment,
} from './edit-comment';

describe('editComment', () => {
  const store = new TestStore();

  const user = createAuthUser();

  const commentId = 'commentId';
  const comment = createComment({ id: commentId, text: 'text' });

  const threadId = 'threadId';
  const thread = createThread({ id: threadId, comments: [comment] });

  const text = 'updated';
  const now = new Date('2022-01-01');

  beforeEach(() => {
    store.dispatch(setUser({ user }));
    store.dispatch(addThread(thread));
    store.dispatch(addComments([comment]));
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

    expect(store.threadGateway.editComment).toHaveBeenCalledWith(threadId, commentId, text);
  });

  it('updates the comment text and edition date', async () => {
    store.dispatch(setEditCommentFormText(commentId, text));

    await execute();

    const comment = store.select(selectComment, commentId);

    expect(comment).toHaveProperty('text', text);
    expect(comment).toHaveProperty('edited', now.toISOString());
  });

  it('requires user authentication', async () => {
    store.dispatch(unsetUser());

    await execute();

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(true);
  });

  it('closes the edition form', async () => {
    await execute();

    expect(store.select(selectIsSubmittingCommentEditionForm, commentId)).toBe(false);
  });

  it('shows a snack when the edition succeeded', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre commentaire a bien été mis à jour.');
  });

  it('shows a snack when the edition failed', async () => {
    const error = new Error('nope.');

    store.threadGateway.editComment.mockRejectedValue(error);

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
