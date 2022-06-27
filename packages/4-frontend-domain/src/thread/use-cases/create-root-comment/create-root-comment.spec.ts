import { setUser } from '../../../authentication/user.slice';
import { createAuthUser, createThread, TestStore } from '../../../test';
import { addThread, setCreateCommentText, setThreadComments } from '../../thread.actions';
import {
  selectCreateCommentText,
  selectIsCreatingComment,
  selectThreadComments,
} from '../../thread.selectors';

import { createRootComment } from './create-root-comment';

describe('createRootComment', () => {
  const store = new TestStore();

  const user = createAuthUser();

  const threadId = 'threadId';
  const text = 'text';

  const now = new Date('2022-01-01');
  const commentId = 'commentId';

  beforeEach(() => {
    store.dispatch(setUser({ user }));
    store.dispatch(addThread(createThread({ id: threadId })));
    store.dispatch(setThreadComments(threadId, []));

    store.dateGateway.setNow(now);
    store.threadGateway.createComment.mockResolvedValue(commentId);
  });

  it('creates a new comment', async () => {
    const promise = store.dispatch(createRootComment(threadId, text));

    expect(store.select(selectIsCreatingComment, threadId)).toBe(true);

    await promise;

    expect(store.select(selectIsCreatingComment, threadId)).toBe(false);

    expect(store.threadGateway.createComment).toHaveBeenCalledWith(threadId, text);
  });

  it('adds the created comment to thread', async () => {
    await store.dispatch(createRootComment(threadId, text));

    expect(store.select(selectThreadComments, threadId)).toContainEqual({
      id: commentId,
      author: {
        id: user.id,
        nick: user.nick,
        profileImage: user.profileImage,
      },
      text,
      date: now.toISOString(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
    });
  });

  it('clears the message input text', async () => {
    store.dispatch(setCreateCommentText(threadId, 'hello'));

    await store.dispatch(createRootComment(threadId, text));

    expect(store.select(selectCreateCommentText, threadId)).toEqual('');
  });

  it('shows a snack when the creation succeeded', async () => {
    await store.dispatch(createRootComment(threadId, text));

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre commentaire a bien été créé.');
  });

  it('shows a snack when the creation failed', async () => {
    const error = new Error('nope.');

    store.threadGateway.createComment.mockRejectedValue(error);

    await store.dispatch(createRootComment(threadId, text));

    expect(store.snackbarGateway.error).toHaveBeenCalledWith(
      "Une erreur s'est produite, votre commentaire n'a pas été créé.",
    );
  });
});
