import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { array } from '@shakala/shared';

import { controls } from '~/utils/storybook';

import { InfiniteScroll } from './infinite-scroll';

type StoryArgs = {
  total: number;
  loadingTimeout: number;
};

export default {
  title: 'Elements/InfiniteScroll',
  args: {
    total: 42,
    loadingTimeout: 1000,
  },
  argTypes: {
    total: controls.range(42, { min: 1, max: 200 }),
    loadingTimeout: controls.range(1000, { min: 0, max: 10 * 1000 }),
  },
} as Meta<StoryArgs>;

const nextItems = (total: number, items: number[] = []) => {
  const length = items.length;
  const count = Math.min(10, total - items.length);

  return array(count, (index) => index + length + 1);
};

export const infiniteScroll: StoryFn<StoryArgs> = ({ total, loadingTimeout }) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(nextItems(total));

  const loadMore = () => {
    setLoading(true);

    setTimeout(() => {
      setItems((items) => [...items, ...nextItems(total, items)]);
      setLoading(false);
    }, loadingTimeout);
  };

  return (
    <div className="col gap-4">
      <InfiniteScroll items={items} hasMore={items.length < total} loading={loading} loadMore={loadMore}>
        {(item) => (
          <div key={item} className="row h-12 w-12 items-center justify-center bg-muted/10">
            item {item}
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};
