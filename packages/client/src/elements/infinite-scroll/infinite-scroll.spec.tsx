import expect from '@nilscox/expect';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import { InfiniteScroll } from './infinite-scroll';

describe('InfiniteScroll', () => {
  const props: React.ComponentProps<typeof InfiniteScroll<number>> = {
    items: [1, 2],
    hasMore: false,
    loadMore: () => {},
    children: (item) => <div key={item}>item {item}</div>,
  };

  it('renders the list of items', () => {
    render(<InfiniteScroll {...props} />);

    expect(screen.getByText('item 1')).toBeVisible();
    expect(screen.getByText('item 2')).toBeVisible();
  });
});
