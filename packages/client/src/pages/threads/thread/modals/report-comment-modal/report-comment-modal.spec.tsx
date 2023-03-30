import expect from '@nilscox/expect';
import { createAuthorDto, createCommentDto } from '@shakala/shared';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { setupTest } from '~/utils/setup-test';

import { ReportCommentModal } from './report-comment-modal';

describe('ReportCommentModal', () => {
  const { render, setSearchParam, commentAdapter } = setupTest();

  beforeEach(() => {
    const comment = createCommentDto({
      id: 'commentId',
      author: createAuthorDto({ nick: 'gros naze' }),
      text: 'you suck.',
    });

    setSearchParam('report', comment.id);
    commentAdapter.getComment.resolve(comment);
  });

  afterEach(cleanup);

  it('renders the modal allowing the user to report a comment', async () => {
    render(<ReportCommentModal />);
    document.body.removeAttribute('aria-hidden');

    expect(await screen.findByRole('heading')).toHaveTextContent('Signaler le commentaire de gros naze');
    expect(screen.getByText('you suck.')).toBeVisible();
  });

  it('submits the report form', async () => {
    const reason = 'Le commentaire est en anglais.';

    const user = render(<ReportCommentModal />);
    document.body.removeAttribute('aria-hidden');

    await user.type(await screen.findByRole('textbox'), reason);
    await user.click(screen.getByRole('button', { name: 'Signaler' }));

    expect(commentAdapter.reportComment).calledWith('commentId', expect.stringMatching(new RegExp(reason)));
  });

  it('closes the report modal', async () => {
    const user = render(<ReportCommentModal />);
    document.body.removeAttribute('aria-hidden');

    await user.click(await screen.findByRole('button', { name: 'Annuler' }));

    await waitFor(() => {
      expect(screen.queryByText('you suck.')).toBe(null);
    });
  });
});
