import expect from '@nilscox/expect';
import { createAuthorDto, createCommentDto, createThreadDto, stub } from '@shakala/shared';
import { screen } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';

import { setupTest } from '~/utils/setup-test';

import { ReplyForm } from './reply-form';
import { RootCommentForm } from './root-comment-form';

vi.mock('~/elements/rich-text-editor');

describe('CommentForm', () => {
  const { render, setRouteParam, adapters } = setupTest();

  const thread = createThreadDto({
    id: 'threadId',
    author: createAuthorDto({ nick: 'author' }),
  });

  beforeEach(() => {
    setRouteParam('threadId', 'threadId');
  });

  it('creates a new root comment', async () => {
    adapters.comment.createComment.resolve('commentId');

    const user = render(<RootCommentForm thread={thread} />);

    const input = await screen.findByPlaceholderText('Répondre à author');

    await user.type(input, 'comment');
    await user.click(screen.getByText('Envoyer'));

    expect(adapters.comment.createComment).calledWith('threadId', expect.stringMatching(/comment/));

    expect(input).toHaveValue('');
  });

  it('clears the value when the comment creation did not complete', async () => {
    adapters.comment.createComment.reject(new Error());

    const user = render(<RootCommentForm thread={thread} />);

    const input = await screen.findByPlaceholderText('Répondre à author');

    await user.type(input, 'comment');
    await user.click(screen.getByText('Envoyer'));

    expect(input).toHaveValue(expect.stringMatching(/comment/));
  });

  it('creates a new reply to an existing comment', async () => {
    const parent = createCommentDto({ id: 'parentId' });

    adapters.comment.createReply.resolve('replyId');

    const closeReplyForm = stub();

    const user = render(
      <ReplyForm parent={parent} isReplying={true} openReplyForm={stub()} closeReplyForm={closeReplyForm} />
    );

    await user.type(await screen.findByPlaceholderText('Rédigez votre message'), 'reply');
    await user.click(screen.getByText('Envoyer'));

    expect(closeReplyForm).called();
  });

  it('shows an error message when the user is not the author of the comment', async () => {
    const parent = createCommentDto({ id: 'parentId' });

    adapters.comment.createReply.reject(new Error('UserMustBeAuthorError'));

    const user = render(
      <ReplyForm parent={parent} isReplying={true} openReplyForm={stub()} closeReplyForm={stub()} />
    );

    await user.type(await screen.findByPlaceholderText('Rédigez votre message'), 'reply');
    await user.click(screen.getByText('Envoyer'));

    expect(screen.getByText("Vous devez être l'auteur du message pour pouvoir l'éditer.")).toBeVisible();
  });
});
