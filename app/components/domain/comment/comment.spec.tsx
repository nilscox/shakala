import { render, screen } from '@testing-library/react';

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
      repliesCount: 11,
    });

    render(<Comment comment={comment} />);

    expect(screen.getByText('Paul')).toBeDefined();
    expect(screen.getByText('1 mai 2022, 10:00')).toBeDefined();
    expect(screen.getByText('Hello!')).toBeDefined();
    expect(screen.getByText('41')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
    expect(screen.getByText('11 réponses')).toBeDefined();
  });
});
