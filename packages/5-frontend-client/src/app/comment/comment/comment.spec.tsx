import { screen } from '@testing-library/react';
import {
  commentActions,
  createComment,
  createTestStore,
  createUser,
  TestStore,
} from '@shakala/frontend-domain';

import { createTestRenderer, TestRenderer } from '~/utils/test-renderer';

import { Comment } from './comment';

describe('Comment', () => {
  let store: TestStore;
  let render: TestRenderer;

  beforeEach(() => {
    store = createTestStore();
    render = createTestRenderer().withStore(store);
  });

  it.skip('renders a comment', () => {
    const comment = createComment({
      author: createUser({ nick: 'Paul' }),
      date: new Date('2022-05-01T10:00').toString(),
      text: 'Hello!',
      upvotes: 41,
      downvotes: 6,
    });

    store.dispatch(commentActions.addComment(comment));

    render(<Comment commentId={comment.id} />);

    expect(screen.getByText('Paul')).toBeDefined();
    expect(screen.getByText('Le 1 mai 2022')).toBeDefined();
    expect(screen.getByText('Hello!')).toBeDefined();
    expect(screen.getByText('41')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
  });
});
