import { AuthorizationErrorReason } from 'shared';

import { DraftCommentKind } from '../../../gateways/draft-messages.gateway';
import { createTestStore, TestStore } from '../../../test-store';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationSelectors } from '../../authentication';
import { AuthorizationError } from '../../authorization';
import { AuthUser, createAuthUser } from '../../user-account';
import { commentActions } from '../comment.actions';
import { commentSelectors } from '../comment.selectors';
import { Comment, createComment } from '../comment.types';

describe('editComment', () => {
  let store: TestStore;

  let user: AuthUser;
  let comment: Comment;

  beforeEach(() => {
    store = createTestStore();

    user = createAuthUser();
    store.user = user;

    comment = createComment({ id: 'commentId', text: 'text', date: new Date('2022-01-01').toISOString() });
    store.dispatch(commentActions.addComment(comment));
    store.dispatch(commentActions.setEditing(comment.id, true));

    store.dateGateway.setNow(new Date('2022-01-02'));
    store.commentGateway.editComment.resolve();
  });

  const editComment = (text = 'edited') => {
    return store.dispatch(commentActions.editComment(comment.id, text));
  };

  const getDraftEdition = () => {
    return store.draftMessagesGateway.getDraftCommentText(DraftCommentKind.edition, comment.id);
  };

  const setDraftEdition = (text: string) => {
    return store.draftMessagesGateway.setDraftCommentText(DraftCommentKind.edition, comment.id, text);
  };

  it("edits an existing comment's message", async () => {
    await expect.async(editComment()).toBe(true);

    expect(store.select(commentSelectors.byId, comment.id)).toHaveProperty('text', 'edited');
  });

  it('trims the given text', async () => {
    await editComment(' edited  ');

    expect(store.commentGateway.editComment.lastCall).toHaveProperty('1', 'edited');
    expect(store.select(commentSelectors.byId, comment.id)).toHaveProperty('text', 'edited');
  });

  it("update the comment's last edition date", async () => {
    await editComment();

    expect(store.select(commentSelectors.byId, comment.id)).toHaveProperty(
      'edited',
      new Date('2022-01-02').toISOString(),
    );
  });

  it("appends the old comment's text to its history", async () => {
    await editComment('edited 1');

    expect(store.select(commentSelectors.byId, comment.id)).toHaveProperty('history', [
      { date: new Date('2022-01-01').toISOString(), text: 'text' },
    ]);

    store.dispatch(commentActions.setEditing(comment.id, true));
    store.dateGateway.setNow(new Date('2022-01-03'));

    await editComment('edited 2');

    expect(store.select(commentSelectors.byId, comment.id)).toHaveProperty('history', [
      { date: new Date('2022-01-01').toISOString(), text: 'text' },
      { date: new Date('2022-01-02').toISOString(), text: 'edited 1' },
    ]);
  });

  it('requires user authentication', async () => {
    store.user = null;

    await expect.async(editComment()).toBe(false);

    expect(store.select(authenticationSelectors.isModalOpen)).toBe(true);
  });

  it('shows a snack when the edition succeeded', async () => {
    await editComment();

    expect(store.snackbarGateway).toHaveSnack('success', 'Votre commentaire a bien été mis à jour.');
  });

  it('closes the comment edition form', async () => {
    await editComment();

    expect(store.select(commentSelectors.isEditing, comment.id)).toBe(false);
  });

  it('clears the persisted draft edition text', async () => {
    await setDraftEdition('text');

    await editComment();

    expect(await getDraftEdition()).toBe(undefined);
  });

  describe('authorization error handling', () => {
    it('shows a snack when the user is not authorized to edit to a comment', async () => {
      store.commentGateway.editComment.reject(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await editComment();

      expect(store.snackbarGateway).toHaveSnack('error', expect.stringMatching(/éditer un commentaire.$/));
    });

    it("shows a snack when the user tries to edit another user's comment", async () => {
      store.commentGateway.editComment.reject(new AuthorizationError('UserMustBeAuthor'));

      await expect.async(editComment()).toBe(false);

      expect(store.snackbarGateway).toHaveSnack(
        'error',
        "Vous devez être l'auteur du message pour pouvoir l'éditer.",
      );
    });
  });

  describe('error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.commentGateway.editComment.reject(error);
    });

    it('throws the validation errors', async () => {
      const error = new ValidationErrors({});

      store.commentGateway.editComment.reject(error);

      await expect.rejects(editComment()).with(error);
    });

    it('returns false when the comment edition failed', async () => {
      store.commentGateway.editComment.reject(new Error('nope.'));

      await expect.async(editComment()).toBe(false);
    });

    it('logs the unhandled errors', async () => {
      await editComment();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('displays a fallback message to inform that the comment was not edited', async () => {
      await editComment();

      expect(store.snackbarGateway).toHaveSnack(
        'error',
        "Une erreur s'est produite, votre commentaire n'a pas été mis à jour.",
      );
    });
  });

  describe('getInitialEditionText', () => {
    let draft: string | undefined = undefined;

    beforeEach(() => {
      draft = undefined;
    });

    const setDraft = (text: string) => {
      draft = text;
    };

    it("returns the comment's text when there is no saved draft", async () => {
      await store.dispatch(commentActions.getInitialEditionText(comment.id, setDraft));

      expect(draft).toEqual(comment.text);
    });

    it('returns the draft comment edition text', async () => {
      await setDraftEdition('draft');

      await store.dispatch(commentActions.getInitialEditionText(comment.id, setDraft));

      expect(draft).toEqual('draft');
    });
  });

  describe('saveDraftEdition', () => {
    it('stores a draft comment edition text', async () => {
      await store.dispatch(commentActions.saveDraftEditionText(comment.id, 'draft'));

      expect(await getDraftEdition()).toEqual('draft');
    });
  });

  describe('closeEditionForm', () => {
    it('sets the editing flag to false when closing the edition form', async () => {
      await store.dispatch(commentActions.closeEditionForm(comment.id));

      expect(await store.select(commentSelectors.isEditing, comment.id)).toBe(false);
    });

    it('clear the persisted draft edition text', async () => {
      await store.dispatch(commentActions.closeEditionForm(comment.id));

      expect(await getDraftEdition()).toBe(undefined);
    });
  });
});
