import { CommentSort, isCommentSort, ThreadDto } from '@shakala/shared';
import { clsx } from 'clsx';
import { FormEventHandler, useCallback } from 'react';

import { Input } from '~/elements/input';
import { RadioItem, RadiosGroup } from '~/elements/radio-group';
import { useSearchParam } from '~/hooks/use-search-params';
import IconArrowDown from '~/icons/arrow-down.svg';
import IconArrowUp from '~/icons/arrow-up.svg';
import IconSearch from '~/icons/search.svg';

export type ThreadFiltersProps = {
  thread: ThreadDto;
  className?: string;
};

export const ThreadFilters = ({ className }: ThreadFiltersProps) => {
  const [search, setSearch] = useSearchParam('search');
  const [sort, setSort] = useSearchParam('sort');

  const handleChange = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      const data = new FormData(event.currentTarget);

      const search = String(data.get('search'));
      const sort = String(data.get('sort'));

      if (!isCommentSort(sort)) {
        console.warn(`invalid sort value "${sort}"`);
        return;
      }

      setSearch(search);
      setSort(sort === CommentSort.relevance ? undefined : sort);
    },
    [setSearch, setSort]
  );

  return (
    <form className={clsx('col sm:row items-start gap-4 sm:items-center', className)} onChange={handleChange}>
      <Input
        type="search"
        name="search"
        placeholder="Rechercher..."
        className="grow"
        defaultValue={search ?? ''}
        start={<IconSearch className="my-0.5 ml-1 fill-muted" />}
      />

      <RadiosGroup className="text-muted">
        <RadioItem
          name="sort"
          id={CommentSort.dateAsc}
          title="Les plus anciens en premier"
          defaultChecked={sort === CommentSort.dateAsc}
        >
          date <IconArrowUp className="fill-muted p-0.5" />
        </RadioItem>

        <RadioItem
          name="sort"
          id={CommentSort.dateDesc}
          title="Les plus récents en premier"
          defaultChecked={sort === CommentSort.dateDesc}
        >
          date <IconArrowDown className="fill-muted p-0.5" />
        </RadioItem>

        <RadioItem
          name="sort"
          id={CommentSort.relevance}
          title="Les mieux notés en premier"
          defaultChecked={sort ? sort === CommentSort.relevance : true}
        >
          pertinence
        </RadioItem>
      </RadiosGroup>
    </form>
  );
};
