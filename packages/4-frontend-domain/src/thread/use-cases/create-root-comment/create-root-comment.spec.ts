import { selectIsAuthenticationModalOpen } from '../../../authentication';
import { setUser, unsetUser } from '../../../authentication/user.slice';
import { createAuthUser, createThread, TestStore } from '../../../test';
import { selectCreatedRootComments } from '../../lists/created-root-comments';
import { addThread } from '../../thread.actions';
import { selectCommentThreadId } from '../../thread.selectors';

import {
  createRootComment,
  selectCreateRootCommentError,
  selectCreateRootCommentFormText,
  selectIsSubmittingRootCommentForm,
  setCreateRootCommentText,
} from './create-root-comment';

describe('createRootComment', () => {
  const store = new TestStore();

  const user = createAuthUser();

  const threadId = 'threadId';
  const thread = createThread({ id: threadId });
  const text = 'text';

  const now = new Date('2022-01-01');
  const commentId = 'commentId';

  beforeEach(() => {
    store.dispatch(setUser({ user }));
    store.dispatch(addThread(thread));
    store.dispatch(setCreateRootCommentText(threadId, text));

    store.dateGateway.setNow(now);
    store.threadGateway.createComment.mockResolvedValue(commentId);
  });

  const execute = () => {
    return store.dispatch(createRootComment(threadId));
  };

  it('creates a new comment', async () => {
    const promise = execute();

    expect(store.select(selectIsSubmittingRootCommentForm, threadId)).toBe(true);
    await promise;
    expect(store.select(selectIsSubmittingRootCommentForm, threadId)).toBe(false);

    expect(store.threadGateway.createComment).toHaveBeenCalledWith(threadId, text);
  });

  it('adds the new comment to the list of created comments', async () => {
    await execute();

    const createdComments = store.select(selectCreatedRootComments);

    expect(createdComments).toHaveLength(1);
    expect(createdComments[0]).toEqual({
      id: commentId,
      author: {
        id: user.id,
        nick: user.nick,
        profileImage: user.profileImage,
      },
      text,
      date: now.toISOString(),
      edited: false,
      upvotes: 0,
      downvotes: 0,
      replies: [],
    });
  });

  it('adds the created comment to the thread', async () => {
    await execute();

    expect(store.select(selectCommentThreadId, commentId)).toEqual(threadId);
  });

  it('requires user authentication', async () => {
    store.dispatch(unsetUser());

    await execute();

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(true);
  });

  it('clears the message input text', async () => {
    store.dispatch(setCreateRootCommentText(threadId, 'hello'));

    await execute();

    expect(store.select(selectCreateRootCommentFormText, threadId)).toEqual('');
  });

  it('shows a snack when the creation succeeded', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre commentaire a bien été créé.');
  });

  describe('error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.threadGateway.createComment.mockRejectedValue(error);
    });

    it('stores the error', async () => {
      await execute();

      expect(store.select(selectIsSubmittingRootCommentForm, threadId)).toBe(false);
      expect(store.select(selectCreateRootCommentError, threadId)).toHaveProperty('message', error.message);
    });

    it('logs the error', async () => {
      await execute();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('shows a snack', async () => {
      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        "Une erreur s'est produite, votre commentaire n'a pas été créé.",
      );
    });
  });
});
