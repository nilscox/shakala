import { screen } from '@testing-library/dom';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addComment, Comment, createComment, createDate, createUser, TestStore } from 'frontend-domain';
import { createMemoryHistory } from 'history';

import { TestRenderer } from '~/test/render';

import { CommentHistoryModal } from './comment-history-modal';

describe('CommentHistoryModal', () => {
  const store = new TestStore();

  const setup = (comment: Comment) => {
    const history = createMemoryHistory({
      initialEntries: ['?' + new URLSearchParams({ historique: comment.id })],
    });

    store.dispatch(addComment(comment));

    new TestRenderer()
      .withMemoryRouter(history)
      .withRedux(store)
      .render(<CommentHistoryModal />);
  };

  it("navigates through a comment's edition history", async () => {
    const user = userEvent.setup();

    const comment = createComment({
      author: createUser({ nick: 'Nick' }),
      text: 'last edition',
      edited: createDate('2022-01-03'),
      history: [
        { text: 'first edition', date: createDate('2022-01-01') },
        { text: 'second edition', date: createDate('2022-01-02') },
      ],
    });

    setup(comment);

    expect(screen.getByText('Nick')).toBeVisible();

    expect(screen.getByText('Version 2')).toBeVisible();

    expect(screen.getByText('Le 3 janvier 2022 à 00:00')).toBeVisible();
    expect(screen.getByText('last')).toBeVisible();

    expect(screen.getByText('Le 2 janvier 2022 à 00:00')).toBeVisible();
    expect(screen.getByText('second')).toBeVisible();

    expect(screen.getByTitle('Version suivante')).toBeDisabled();

    await act(() => user.click(screen.getByTitle('Version précédente')));

    expect(screen.getByText('Version 1')).toBeVisible();

    expect(screen.getByText('Le 2 janvier 2022 à 00:00')).toBeVisible();
    expect(screen.getByText('second')).toBeVisible();

    expect(screen.getByText('Le 1 janvier 2022 à 00:00')).toBeVisible();
    expect(screen.getByText('first')).toBeVisible();

    expect(screen.getByTitle('Version précédente')).toBeDisabled();

    await act(() => user.click(screen.getByTitle('Version suivante')));

    expect(screen.getByText('Version 2')).toBeVisible();
  });
});
