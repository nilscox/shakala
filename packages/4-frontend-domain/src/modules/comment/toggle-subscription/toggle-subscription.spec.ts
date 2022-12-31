import { createTestStore, TestStore } from '../../../test-store';
import { AuthenticatedUser, createAuthUser } from '../../user-account';
import { commentActions } from '../comment.actions';
import { commentSelectors } from '../comment.selectors';
import { Comment, createComment } from '../comment.types';

import { toggleSubscription } from './toggle-subscription';

describe('toggleSubscription', () => {
  let store: TestStore;

  let user: AuthenticatedUser;
  let comment: Comment;

  beforeEach(() => {
    store = createTestStore();

    user = createAuthUser();
    store.user = user;

    comment = createComment({ isSubscribed: false });
    store.dispatch(commentActions.addComment(comment));
  });

  it('subscribes to a comment', async () => {
    store.commentGateway.subscribe.resolve();

    await store.dispatch(toggleSubscription(comment.id));

    expect(store.select(commentSelectors.isSubscribed, comment.id)).toBe(true);
  });

  it('unsubscribes to a comment', async () => {
    store.dispatch(commentActions.setSubscribed(comment.id, true));

    store.commentGateway.unsubscribe.resolve();

    await store.dispatch(toggleSubscription(comment.id));

    expect(store.select(commentSelectors.isSubscribed, comment.id)).toBe(false);
  });

  it('rolls back to the previous value when the gateway call fails', async () => {
    store.commentGateway.subscribe.reject(new Error('nope.'));

    await store.dispatch(toggleSubscription(comment.id));

    expect(store.select(commentSelectors.isSubscribed, comment.id)).toBe(false);
  });

  it('shows an error when the subscription action fails', async () => {
    store.commentGateway.subscribe.reject(new Error('nope.'));

    await store.dispatch(toggleSubscription(comment.id));

    expect(store.snackbarGateway).toHaveSnack(
      'error',
      "Une erreur s'est produite, votre action n'a pas pu être prise en compte.",
    );
  });

  it('logs unknown errors', async () => {
    const error = new Error('nope.');

    store.commentGateway.subscribe.reject(error);

    await store.dispatch(toggleSubscription(comment.id));

    expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
  });
});
