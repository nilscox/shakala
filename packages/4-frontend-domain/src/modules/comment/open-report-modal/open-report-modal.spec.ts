import { createTestStore, TestStore } from '../../../test-store';
import { authenticationSelectors } from '../../authentication';
import { routerSelectors } from '../../router';
import { createUser, User } from '../../user';
import { createAuthUser } from '../../user-account';
import { commentActions } from '../comment.actions';
import { createComment } from '../comment.types';

import { openReportModal } from './open-report-modal';

describe('openReportModal', () => {
  let store: TestStore;
  let author: User;

  beforeEach(() => {
    store = createTestStore();
    store.user = createAuthUser();

    author = createUser();
    store.dispatch(commentActions.addComment(createComment({ id: 'commentId', author })));
  });

  it('opens the report modal', () => {
    store.user = createAuthUser();

    store.dispatch(openReportModal('commentId'));

    expect(store.select(routerSelectors.queryParam, 'report')).toEqual('commentId');
  });

  it('requires user authentication', () => {
    store.user = null;

    store.dispatch(openReportModal('commentId'));

    expect(store.select(routerSelectors.queryParam, 'report')).toBe(undefined);
    expect(store.select(authenticationSelectors.isModalOpen)).toBe(true);
  });

  it('shows a notification when the user is not authenticated', () => {
    store.user = null;

    store.dispatch(openReportModal('commentId'));

    expect(store.snackbarGateway).toHaveSnack(
      'warning',
      'Vous devez vous connecter pour pouvoir signaler un commentaire.',
    );
  });

  it('shows a notification when the user tries to report his own comment', () => {
    store.user = createAuthUser(author);

    store.dispatch(openReportModal('commentId'));

    expect(store.snackbarGateway).toHaveSnack(
      'warning',
      "Vous ne pouvez pas signalez les commentaires dont vous êtes l'auteur.",
    );
  });
});
