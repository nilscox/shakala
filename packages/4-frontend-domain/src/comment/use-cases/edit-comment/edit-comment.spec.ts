import { setUser } from '../../../authentication/user.slice';
import { createAuthUser, createComment, createThread, TestStore } from '../../../test';
import { addThread } from '../../../thread/thread.actions';
import { AuthorizationError } from '../../../types';
import { addComments, setIsEditingComment } from '../../comments.actions';
import { selectComment, selectCommentEditionText, selectIsEditingComment } from '../../comments.selectors';

import { editComment } from './edit-comment';

describe('editComment', () => {
  const store = new TestStore();

  const user = createAuthUser();

  const commentId = 'commentId';
  const comment = createComment({ id: commentId, text: 'text' });

  const threadId = 'threadId';
  const thread = createThread({ id: threadId, comments: [commentId] });

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
    return store.dispatch(editComment(commentId, text));
  };

  it("initializes the edition form text with the comment's text", () => {
    expect(store.select(selectCommentEditionText, commentId)).toEqual(comment.text);
  });

  it('updates an existing comment', async () => {
    const promise = execute();

    expect(store.select(selectIsEditingComment, commentId)).toBe(true);
    await promise;
    expect(store.select(selectIsEditingComment, commentId)).toBe(false);

    expect(store.threadGateway.editComment).toHaveBeenCalledWith(threadId, commentId, text);
  });

  it('updates the comment text and edition date', async () => {
    await execute();

    const comment = store.select(selectComment, commentId);

    expect(comment).toHaveProperty('text', text);
    expect(comment).toHaveProperty('edited', now.toISOString());
  });

  it('closes the edition form', async () => {
    await execute();

    expect(store.select(selectIsEditingComment, commentId)).toBe(false);
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
