import {
  commentActions,
  commentSelectors,
  createAuthUser,
  createComment,
  createThread,
  createUser,
  threadActions,
} from '@shakala/frontend-domain';
import { TestStore, createTestStore } from '@shakala/frontend-domain/test';
import { screen } from '@testing-library/react';

import { createTestRenderer, TestRenderer } from '../../../utils/test-renderer';

import { CommentEditionForm } from './comment-edition-form';
import { ReplyForm } from './reply-form';
import { RootCommentForm } from './root-comment-form';

describe('CommentForm', () => {
  let store: TestStore;
  let render: TestRenderer;

  beforeEach(() => {
    store = createTestStore();
    render = createTestRenderer().withStore(store);
  });

  const threadId = 'threadId';
  const author = createUser({ nick: 'author' });
  const thread = createThread({ id: threadId, author });

  beforeEach(() => {
    store.user = createAuthUser();
    store.dispatch(threadActions.setThread(thread));
  });

  it('creates a new root comment', async () => {
    store.threadGateway.createComment.resolve('commentId');

    const user = render(<RootCommentForm threadId={threadId} author={author} />);

    const input = await screen.findByPlaceholderText('Répondre à author');

    await user.type(input, 'comment');
    await user.click(screen.getByText('Envoyer'));

    expect(store.select(commentSelectors.byId, 'commentId')).toBeDefined();

    expect(input).toHaveValue('');
  });

  it('does not clear the form when the comment creation did not complete', async () => {
    store.user = null;

    const user = render(<RootCommentForm threadId={threadId} author={author} />);

    const input = await screen.findByPlaceholderText('Répondre à author');

    await user.type(input, 'comment');
    await user.click(screen.getByText('Envoyer'));

    expect(input).toHaveValue('comment');
  });

  it('creates a new reply to an existing comment', async () => {
    const parentId = 'parentId';
    const parentComment = createComment({ id: parentId });

    store.dispatch(commentActions.addComment(parentComment));
    store.dispatch(threadActions.setComments(threadId, [parentComment]));

    store.commentGateway.createReply.resolve('replyId');

    const user = render(<ReplyForm parentId={parentId} />);

    await user.click(screen.getByPlaceholderText('Répondre'));

    const input = await screen.findByPlaceholderText('Rédigez votre message');

    await user.type(input, 'reply');
    await user.click(screen.getByText('Envoyer'));

    expect(store.select(commentSelectors.isReplying, parentId)).toBe(false);
    expect(store.select(commentSelectors.byId, 'replyId')).toBeDefined();
    expect(store.select(commentSelectors.byId, parentId)).toHaveProperty('replies.0.id', 'replyId');

    expect(screen.getByPlaceholderText('Répondre')).toBeVisible();
  });

  it('edits an existing comment', async () => {
    const commentId = 'commentId';
    const comment = createComment({ id: commentId, text: 'initial text' });

    store.dispatch(commentActions.addComment(comment));
    store.dispatch(threadActions.addComments(threadId, [comment]));
    store.dispatch(commentActions.setEditing(commentId, true));

    store.commentGateway.editComment.resolve();

    const user = render(<CommentEditionForm commentId={commentId} />);

    const input = await screen.findByPlaceholderText('Rédigez votre message');

    expect(input).toHaveValue('initial text');

    await user.clear(input);
    await user.type(input, 'edited text');
    await user.click(screen.getByText('Envoyer'));

    expect(store.select(commentSelectors.isEditing, commentId)).toBe(false);
    expect(store.select(commentSelectors.byId, commentId)).toHaveProperty('text', 'edited text');
  });
});
