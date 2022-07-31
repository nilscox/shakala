import { selectIsAuthenticationModalOpen } from '../../../authentication';
import { setUser, unsetUser } from '../../../authentication/user.slice';
import { addComments } from '../../../comment';
import { createAuthUser, createComment, createThread, TestStore } from '../../../test';
import {
  selectCreateRootCommentFormText,
  selectThreadComments,
  setCreateRootCommentText,
  setGetThreadCommentsQueryResult,
} from '../../index';
import { addThread, setThreadComments } from '../../thread.actions';

import { createRootComment, selectIsSubmittingRootCommentForm } from './create-root-comment';

describe('createRootComment', () => {
  const store = new TestStore();

  const user = createAuthUser();

  const existingComment = createComment();
  const threadId = 'threadId';
  const thread = createThread({ id: threadId, comments: [existingComment] });
  const text = 'text';

  const now = new Date('2022-01-01');
  const commentId = 'commentId';

  beforeEach(() => {
    store.dispatch(setUser({ user }));
    store.dispatch(addThread(thread));
    store.dispatch(addComments([existingComment]));
    store.dispatch(setThreadComments(threadId, [existingComment]));
    store.dispatch(setGetThreadCommentsQueryResult(threadId, [existingComment.id]));
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

  it('adds the created comment to the thread', async () => {
    await execute();

    const comments = store.select(selectThreadComments, threadId);

    expect(comments).toHaveLength(2);
    expect(comments).toContainEqual({
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

  it('shows a snack when the creation failed', async () => {
    const error = new Error('nope.');

    store.threadGateway.createComment.mockRejectedValue(error);

    await execute();

    expect(store.snackbarGateway.error).toHaveBeenCalledWith(
      "Une erreur s'est produite, votre commentaire n'a pas été créé.",
    );
  });
});
