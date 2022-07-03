import { setUser } from '../../../authentication/user.slice';
import { createAuthUser, createComment, createThread, TestStore } from '../../../test';
import { addThread, setThreadComments } from '../../../thread/thread.actions';
import { Comment } from '../../../types';
import { addComments, setIsReplying, setReplyFormText } from '../../comments.actions';
import { selectCommentReplies, selectIsSubmittingReply, selectReplyForm } from '../../comments.selectors';

import { createReply } from './create-reply';

describe('createReply', () => {
  const store = new TestStore();

  const user = createAuthUser();

  const threadId = 'threadId';
  const thread = createThread({ id: threadId });

  const parentId = 'parentId';
  const parent = createComment({ id: parentId });
  const text = 'text';

  const now = new Date('2022-01-01');
  const createdCommentId = 'replyId';

  beforeEach(() => {
    store.dispatch(setUser({ user }));

    store.dispatch(addThread(thread));
    store.dispatch(addComments([parent]));
    store.dispatch(setThreadComments(threadId, [parent]));

    store.dispatch(setIsReplying(parentId));
    store.dispatch(setReplyFormText(parentId, text));

    store.dateGateway.setNow(now);
    store.threadGateway.createReply.mockResolvedValue(createdCommentId);
  });

  const execute = () => {
    return store.dispatch(createReply(parentId));
  };

  it('creates a new reply', async () => {
    const promise = execute();

    expect(store.select(selectIsSubmittingReply, parentId)).toBe(true);
    await promise;
    expect(store.select(selectIsSubmittingReply, parentId)).toBeUndefined();

    expect(store.threadGateway.createReply).toHaveBeenCalledWith(threadId, parentId, text);
  });

  it('adds the created comment to list of replies', async () => {
    await execute();

    const created: Comment = {
      id: createdCommentId,
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
    };

    expect(store.select(selectCommentReplies, parentId)).toContainEqual(created);
  });

  it('closes the reply form', async () => {
    await execute();

    expect(store.select(selectReplyForm, parentId)).toBeUndefined();
  });

  it('shows a snack when the creation succeeded', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre réponse a bien été créée.');
  });

  it('shows a snack when the creation failed', async () => {
    const error = new Error('nope.');

    store.threadGateway.createReply.mockRejectedValue(error);

    await execute();

    expect(store.snackbarGateway.error).toHaveBeenCalledWith(
      "Une erreur s'est produite, votre réponse n'a pas été créée.",
    );
  });
});
