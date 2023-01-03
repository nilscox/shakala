import { commentActions, createComment, createUser, routerActions } from '@shakala/frontend-domain';
import { TestStore, createTestStore } from '@shakala/frontend-domain/test';
import { screen } from '@testing-library/react';

import { createTestRenderer, TestRenderer } from '~/utils/test-renderer';

import { ReportCommentModal } from './report-comment-modal';

describe('ReportCommentModal', () => {
  let store: TestStore;
  let render: TestRenderer;

  beforeEach(() => {
    store = createTestStore();
    render = createTestRenderer().withStore(store);
  });

  beforeEach(() => {
    const comment = createComment({
      id: 'commentId',
      author: createUser({ nick: 'gros naze' }),
      text: 'you suck.',
    });

    store.dispatch(commentActions.addComment(comment));
    store.dispatch(routerActions.setQueryParam(['report', 'commentId']));
  });

  it('renders the modal allowing a user to report a comment', () => {
    render(<ReportCommentModal />);
    document.body.removeAttribute('aria-hidden');

    expect(screen.getByRole('heading')).toHaveTextContent('Signaler le commentaire de gros naze');
    expect(screen.getByText('you suck.')).toBeVisible();
  });

  it('submits the report form', async () => {
    const reason = 'Le commentaire est en anglais.';

    const user = render(<ReportCommentModal />);
    document.body.removeAttribute('aria-hidden');

    await user.type(screen.getByRole('textbox'), reason);
    await user.click(screen.getByRole('button', { name: 'Signaler' }));

    expect(store.commentGateway.reportComment.lastCall).toEqual(['commentId', reason]);
  });
});
