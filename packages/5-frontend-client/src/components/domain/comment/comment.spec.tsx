import { screen } from '@testing-library/react';
import {
  addComment,
  createComment,
  createThread,
  createUser,
  TestStore,
  addThread,
  setThreadComments,
} from 'frontend-domain';

import { TestRenderer } from '~/test/render';

import { Comment } from './comment';

describe('Comment', () => {
  const store = new TestStore();

  it('renders a comment', () => {
    const comment = createComment({
      author: createUser({ nick: 'Paul' }),
      date: new Date('2022-05-01T10:00').toString(),
      text: 'Hello!',
      upvotes: 41,
      downvotes: 6,
    });

    store.dispatch(addThread(createThread({ id: 'threadId' })));
    store.dispatch(addComment(comment));
    store.dispatch(setThreadComments('threadId', [comment]));

    new TestRenderer()
      .withMemoryRouter()
      .withRedux(store)
      .render(<Comment commentId={comment.id} />);

    expect(screen.getByText('Paul')).toBeDefined();
    expect(screen.getByText('Le 1 mai 2022')).toBeDefined();
    expect(screen.getByText('Hello!')).toBeDefined();
    expect(screen.getByText('41')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
  });
});
