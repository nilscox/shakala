import { clsx } from 'clsx';
import { setThreadFilters, Sort } from 'frontend-domain';
import { FormEventHandler, useCallback } from 'react';
import { isSort } from 'shared';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '~/components/elements/input';
import { RadioItem, RadiosGroup } from '~/components/elements/radio-group';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSearchParam } from '~/hooks/use-search-param';
import ArrowDownIcon from '~/icons/arrow-down.svg';
import ArrowUpIcon from '~/icons/arrow-up.svg';

export type ThreadFiltersProps = {
  className?: string;
  threadId: string;
};

export const ThreadFilters = ({ className, threadId }: ThreadFiltersProps) => {
  const dispatch = useDispatch();

  const search = useSearchParam('search');
  const sort = useSearchParam('sort');

  const submitFilters = useDebouncedCallback((threadId: string, filters: { search: string; sort: Sort }) => {
    dispatch(setThreadFilters(threadId, filters));
  }, 220);

  const handleChange = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      const data = new FormData(event.currentTarget);

      const search = String(data.get('search'));
      const sort = String(data.get('sort'));

      if (!isSort(sort)) {
        console.warn(`invalid sort value "${sort}"`);
        return;
      }

      submitFilters(threadId, { search, sort });
    },
    [threadId, submitFilters],
  );

  return (
    <form className={clsx('gap-4 items-start sm:items-center col sm:row', className)} onChange={handleChange}>
      <Input
        type="search"
        name="search"
        placeholder="Rechercher..."
        className="grow"
        defaultValue={search ?? ''}
      />

      <RadiosGroup className="text-muted">
        <RadioItem
          name="sort"
          id={Sort.dateAsc}
          title="Les plus anciens en premier"
          defaultChecked={sort === Sort.dateAsc}
        >
          date <ArrowUpIcon className="p-0.5 fill-muted" />
        </RadioItem>

        <RadioItem
          name="sort"
          id={Sort.dateDesc}
          title="Les plus récents en premier"
          defaultChecked={sort === Sort.dateDesc}
        >
          date <ArrowDownIcon className="p-0.5 fill-muted" />
        </RadioItem>

        <RadioItem
          name="sort"
          id={Sort.relevance}
          title="Les mieux notés en premier"
          defaultChecked={sort ? sort === Sort.relevance : true}
        >
          pertinence
        </RadioItem>
      </RadiosGroup>
    </form>
  );
};
