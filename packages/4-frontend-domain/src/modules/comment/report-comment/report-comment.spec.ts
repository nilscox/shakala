import { CommentAlreadyReportedError } from 'shared';

import { StubCommentGateway } from '../../../stubs/stub-comment-gateway';
import { createTestStore, TestStore } from '../../../test-store';
import { routerActions, routerSelectors } from '../../router';
import { createAuthUser } from '../../user-account';
import { commentActions } from '../comment.actions';
import { createComment } from '../comment.types';
import { openReportModal } from '../open-report-modal/open-report-modal';

import { reportComment } from './report-comment';

describe('reportComment', () => {
  let store: TestStore;
  let commentGateway: StubCommentGateway;

  beforeEach(() => {
    store = createTestStore();
    commentGateway = store.commentGateway;

    store.user = createAuthUser();

    store.dispatch(commentActions.addComment(createComment({ id: 'commentId' })));
    store.dispatch(openReportModal('commentId'));
    commentGateway.reportComment.resolve();
  });

  it('reports a comment', async () => {
    await store.dispatch(reportComment(''));

    expect(commentGateway.reportComment.lastCall).toEqual(['commentId', undefined]);
  });

  it('reports a comment with a reason', async () => {
    await store.dispatch(reportComment('reason'));

    expect(commentGateway.reportComment.lastCall).toEqual(['commentId', 'reason']);
  });

  it('closes the comment report modal', async () => {
    await store.dispatch(reportComment(''));

    expect(store.select(routerSelectors.queryParam, 'report')).toBe(undefined);
  });

  it('shows a success notification', async () => {
    await store.dispatch(reportComment(''));

    expect(store.snackbarGateway).toHaveSnack(
      'success',
      'Votre signalement a bien été remonté. Merci pour votre contribution !',
    );
  });

  it('shows a notification when a the comment was already reported', async () => {
    commentGateway.reportComment.reject(new CommentAlreadyReportedError('commentId'));

    await store.dispatch(reportComment(''));

    expect(store.snackbarGateway).toHaveSnack('error', 'Vous avez déjà signalé ce commentaire.');
  });

  it('shows a notification when an unknown error happens', async () => {
    commentGateway.reportComment.reject(new Error('oops'));

    await store.dispatch(reportComment(''));

    expect(store.snackbarGateway).toHaveSnack(
      'error',
      "Une erreur s'est produite, votre signalement n'a pas pu être remonté.",
    );
  });

  it('throws when the report query param is not set', async () => {
    store.dispatch(routerActions.removeQueryParam('report'));

    await expect
      .rejects(store.dispatch(reportComment('')))
      .with(expect.stringMatching(/expected the report query param to be set/));
  });
});
