import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { createComment, createUser } from '~/factories';

import { Comment } from './comment';

describe('Comment', () => {
  it('renders a comment', () => {
    const comment = createComment({
      author: createUser({ nick: 'Paul' }),
      date: new Date('2022-05-01T10:00').toString(),
      text: 'Hello!',
      upvotes: 41,
      downvotes: 6,
    });

    render(
      <MemoryRouter>
        <Comment comment={comment} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Paul')).toBeDefined();
    expect(screen.getByText('le 1 mai')).toBeDefined();
    expect(screen.getByText('Hello!')).toBeDefined();
    expect(screen.getByText('41')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
  });
});
