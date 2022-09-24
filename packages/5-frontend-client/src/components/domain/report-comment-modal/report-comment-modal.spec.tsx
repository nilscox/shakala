import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addComment, createComment, createUser, TestStore } from 'frontend-domain';
import { createMemoryHistory } from 'history';

import { screen, TestRenderer } from '~/test/render';

import { ReportCommentModal } from './report-comment-modal';

describe('ReportCommentModal', () => {
  const store = new TestStore();

  const comment = createComment({ author: createUser({ nick: 'gros naze' }), text: 'you suck.' });

  beforeEach(() => {
    store.dispatch(addComment(comment));
  });

  const render = () => {
    const history = createMemoryHistory({ initialEntries: [`/?report=${comment.id}`] });

    store.routerGateway.setQueryParam('report', comment.id);

    new TestRenderer()
      .withMemoryRouter(history)
      .withRedux(store)
      .render(<ReportCommentModal />);

    document.body.removeAttribute('aria-hidden');
  };

  it('renders the modal allowing a user to report a comment', () => {
    render();
    expect(screen.getByRole('heading')).toHaveTextContent('Signaler le commentaire de gros naze');
    expect(screen.getByText('you suck.')).toBeVisible();
  });

  it('submits the report form', async () => {
    const user = userEvent.setup();
    const reason = 'Le commentaire est en anglais.';

    render();

    await act(() => user.type(screen.getByRole('textbox'), reason));
    await act(() => user.click(screen.getByRole('button', { name: 'Signaler' })));

    expect(store.threadGateway.reportComment).toHaveBeenCalledWith(comment.id, reason);
  });
});
