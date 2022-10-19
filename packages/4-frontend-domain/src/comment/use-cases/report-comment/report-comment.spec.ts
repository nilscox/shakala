import { mockReject, mockResolve } from 'shared';

import { createComment, TestStore } from '../../../test';
import { AuthorizationError } from '../../../types';

import { reportComment } from './report-comment';

describe('reportComment', () => {
  const store = new TestStore();

  const comment = createComment();

  beforeEach(() => {
    store.routerGateway.setQueryParam('report', comment.id);
    store.threadGateway.reportComment = mockResolve();
  });

  const execute = async (reason = '') => {
    await store.dispatch(reportComment(reason));
  };

  it('reports a comment', async () => {
    await execute('');

    expect(store.threadGateway.reportComment).toHaveBeenCalledWith(comment.id, undefined);
  });

  it('reports a comment with a reason', async () => {
    await execute('reason');

    expect(store.threadGateway.reportComment).toHaveBeenCalledWith(comment.id, 'reason');
  });

  it('closes the comment report modal', async () => {
    await execute();

    expect(store.routerGateway.getQueryParam('report')).toBe(undefined);
  });

  it('shows a success notification', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith(
      'Votre signalement a bien été remonté. Merci pour votre contribution !',
    );
  });

  it('shows a notification when a the comment was already reported', async () => {
    store.threadGateway.reportComment = mockReject(new AuthorizationError('CommentAlreadyReported'));

    await execute();

    expect(store.snackbarGateway.error).toHaveBeenCalledWith('Vous avez déjà signalé ce commentaire.');
  });

  it('shows a notification when an unknown error happens', async () => {
    store.threadGateway.reportComment = mockReject(new Error('oops'));

    await execute();

    expect(store.snackbarGateway.error).toHaveBeenCalledWith(
      "Une erreur s'est produite, votre signalement n'a pas pu être remonté.",
    );
  });

  it('throws when the report query param is not set', async () => {
    store.routerGateway.removeQueryParam('report');

    await expect.rejects(execute()).with(expect.stringMatching(/expected the report query param to be set/));
  });
});
