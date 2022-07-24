import { screen } from '@testing-library/react';
import { addComments, createComment, createThread, createUser, TestStore } from 'frontend-domain';
import { addThread, setThreadComments } from 'frontend-domain/src/thread/thread.actions';

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
    store.dispatch(addComments([comment]));
    store.dispatch(setThreadComments('threadId', [comment]));

    new TestRenderer()
      .withMemoryRouter()
      .withRedux(store)
      .render(<Comment commentId={comment.id} />);

    expect(screen.getByText('Paul')).toBeDefined();
    expect(screen.getByText('le 1 mai')).toBeDefined();
    expect(screen.getByText('Hello!')).toBeDefined();
    expect(screen.getByText('41')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
  });
});
