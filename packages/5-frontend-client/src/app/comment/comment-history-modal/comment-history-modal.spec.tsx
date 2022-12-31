import { screen } from '@testing-library/dom';
import {
  commentActions,
  createComment,
  createDate,
  createTestStore,
  createUser,
  routerActions,
  TestStore,
} from '@shakala/frontend-domain';

import { createTestRenderer, TestRenderer } from '~/utils/test-renderer';

import { CommentHistoryModal } from './comment-history-modal';

describe('CommentHistoryModal', () => {
  let store: TestStore;
  let render: TestRenderer;

  beforeEach(() => {
    store = createTestStore();
    render = createTestRenderer().withStore(store);
  });

  it("navigates through a comment's edition history", async () => {
    const comment = createComment({
      author: createUser({ nick: 'Nick' }),
      text: 'last edition',
      edited: createDate('2022-01-03'),
      history: [
        { text: 'first edition', date: createDate('2022-01-01') },
        { text: 'second edition', date: createDate('2022-01-02') },
      ],
    });

    store.dispatch(routerActions.setQueryParam(['historique', comment.id]));
    store.dispatch(commentActions.addComment(comment));

    const user = render(<CommentHistoryModal />);

    expect(screen.getByText('Nick')).toBeVisible();

    expect(screen.getByText('Édition 2')).toBeVisible();

    expect(screen.getByText('Le 3 janvier 2022 à 00:00')).toBeVisible();
    expect(screen.getByText('last')).toBeVisible();

    expect(screen.getByText('Le 2 janvier 2022 à 00:00')).toBeVisible();
    expect(screen.getByText('second')).toBeVisible();

    expect(screen.getByTitle('Version suivante')).toBeDisabled();

    await user.click(screen.getByTitle('Version précédente'));

    expect(screen.getByText('Édition 1')).toBeVisible();

    expect(screen.getByText('Le 2 janvier 2022 à 00:00')).toBeVisible();
    expect(screen.getByText('second')).toBeVisible();

    expect(screen.getByText('Le 1 janvier 2022 à 00:00')).toBeVisible();
    expect(screen.getByText('first')).toBeVisible();

    expect(screen.getByTitle('Version précédente')).toBeDisabled();

    await user.click(screen.getByTitle('Version suivante'));

    expect(screen.getByText('Édition 2')).toBeVisible();
  });

  it('does not crash when the comment is being fetched', () => {
    render(<CommentHistoryModal />);
  });
});
