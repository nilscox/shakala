import expect from '@nilscox/expect';
import { createAuthorDto, createCommentDto, createThreadDto, stub } from '@shakala/shared';
import { screen } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';

import { setupTest } from '~/utils/setup-test';

import { ReplyForm } from './reply-form';
import { RootCommentForm } from './root-comment-form';

describe.skip('CommentForm', () => {
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

  it('does clear the value when the comment creation did not complete', async () => {
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

    await user.type(screen.getByPlaceholderText('Rédigez votre message'), 'reply');
    await user.click(screen.getByText('Envoyer'));

    expect(closeReplyForm).called();
  });
});
