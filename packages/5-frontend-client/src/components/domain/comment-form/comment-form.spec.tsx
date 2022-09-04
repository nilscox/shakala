import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  addComment,
  addThread,
  createAuthUser,
  createComment,
  createThread,
  createUser,
  selectComment,
  selectCommentReplies,
  selectCreatedRootComments,
  selectIsEditingComment,
  setIsEditingComment,
  setThreadComments,
  setUser,
  TestStore,
} from 'frontend-domain';

import { TestRenderer } from '~/test/render';

import { CommentEditionForm } from './comment-edition-form';
import { ReplyForm } from './comment-reply-form';
import { RootCommentForm } from './root-comment-form';

describe('CommentForm', () => {
  const store = new TestStore();

  const threadId = 'threadId';
  const author = createUser({ nick: 'author' });
  const thread = createThread({ id: threadId, author });

  beforeEach(() => {
    store.dispatch(setUser(createAuthUser()));
    store.dispatch(addThread(thread));
  });

  it('creates a new root comment', async () => {
    const user = userEvent.setup();

    new TestRenderer()
      .withMemoryRouter()
      .withRedux(store)
      .render(<RootCommentForm threadId={threadId} author={author} />);

    const input = screen.getByPlaceholderText('Répondre à author');

    await act(async () => {
      await user.type(input, 'comment');
      await user.click(screen.getByText('Envoyer'));
    });

    await waitFor(() => {
      expect(store.select(selectCreatedRootComments)).toHaveLength(1);
    });

    expect(input).toHaveValue('');
  });

  it('creates a new reply to an existing comment', async () => {
    const user = userEvent.setup();

    const parentCommentId = 'parentCommentId';
    const parentComment = createComment({ id: parentCommentId });

    store.dispatch(addComment(parentComment));
    store.dispatch(setThreadComments(threadId, [parentComment]));

    new TestRenderer()
      .withMemoryRouter()
      .withRedux(store)
      .render(<ReplyForm parentId={parentCommentId} />);

    user.click(screen.getByPlaceholderText('Répondre'));

    const input = await screen.findByPlaceholderText('Rédigez votre message');

    await act(async () => {
      await user.type(input, 'reply');
      await user.click(screen.getByText('Envoyer'));
    });

    await waitFor(() => {
      expect(store.select(selectCommentReplies, parentCommentId)).toHaveLength(1);
    });

    expect(screen.getByPlaceholderText('Répondre')).toBeVisible();
  });

  it('edits an existing comment', async () => {
    const user = userEvent.setup();

    const commentId = 'commentId';
    const comment = createComment({ id: commentId, text: 'initial text' });

    store.dispatch(addComment(comment));
    store.dispatch(setThreadComments(threadId, [comment]));
    store.dispatch(setIsEditingComment(commentId));

    new TestRenderer()
      .withMemoryRouter()
      .withRedux(store)
      .render(<CommentEditionForm commentId={commentId} />);

    const input = await screen.findByPlaceholderText('Rédigez votre message');

    expect(input).toHaveValue('initial text');

    await act(async () => {
      await user.clear(input);
      await user.type(input, 'edited text');
      await user.click(screen.getByText('Envoyer'));
    });

    await waitFor(() => {
      expect(store.select(selectIsEditingComment, commentId)).toBe(false);
    });

    expect(store.select(selectComment, commentId)).toHaveProperty('text', 'edited text');
  });
});
