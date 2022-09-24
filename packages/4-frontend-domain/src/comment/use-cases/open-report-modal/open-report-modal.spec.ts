import { selectIsAuthenticationModalOpen, setUser } from '../../../authentication';
import { createAuthUser, createComment, createUser, TestStore } from '../../../test';
import { addComment } from '../../comments.actions';

import { openReportModal } from './open-report-modal';

describe('openReportModal', () => {
  const store = new TestStore();

  const author = createUser();
  const comment = createComment({ author });

  beforeEach(() => {
    store.dispatch(addComment(comment));
  });

  it('opens the report modal', () => {
    store.dispatch(setUser(createAuthUser()));

    store.dispatch(openReportModal(comment.id));

    expect(store.routerGateway.getQueryParam('report')).toEqual(comment.id);
  });

  it('requires user authentication', () => {
    store.dispatch(openReportModal(comment.id));

    expect(store.routerGateway.getQueryParam('report')).toBeUndefined();
    expect(store.select(selectIsAuthenticationModalOpen)).toBe(true);
  });

  it('shows a notification when the user is not authenticated', () => {
    store.dispatch(openReportModal(comment.id));

    expect(store.snackbarGateway.warning).toHaveBeenCalledWith(
      'Vous devez vous connecter pour pouvoir signaler un commentaire.',
    );
  });

  it('shows a notification when the user tries to report his own comment', () => {
    store.dispatch(setUser(createAuthUser(author)));

    store.dispatch(openReportModal(comment.id));

    expect(store.snackbarGateway.warning).toHaveBeenCalledWith(
      "Vous ne pouvez pas signalez les commentaires dont vous êtes l'auteur.",
    );
  });
});
