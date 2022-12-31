import { clsx } from 'clsx';
import { threadActions } from '@shakala/frontend-domain';
import { FormEventHandler, useCallback } from 'react';
import { isSort, Sort } from '@shakala/shared';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '~/elements/input';
import { RadioItem, RadiosGroup } from '~/elements/radio-group';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useSearchParam } from '~/hooks/use-search-param';
import ArrowDownIcon from '~/icons/arrow-down.svg';
import ArrowUpIcon from '~/icons/arrow-up.svg';

export type ThreadFiltersProps = {
  className?: string;
  threadId: string;
};

export const ThreadFilters = ({ className, threadId }: ThreadFiltersProps) => {
  const dispatch = useAppDispatch();

  const search = useSearchParam('search');
  const sort = useSearchParam('sort');

  const setFilters = useDebouncedCallback(
    useCallback(
      (search: string, sort: Sort) => {
        dispatch(threadActions.setThreadSearchFilter(threadId, search));
        dispatch(threadActions.setThreadSortFilter(threadId, sort));
      },
      [dispatch, threadId],
    ),
    220,
  );

  const handleChange = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      const data = new FormData(event.currentTarget);

      const search = String(data.get('search'));
      const sort = String(data.get('sort'));

      if (!isSort(sort)) {
        console.warn(`invalid sort value "${sort}"`);
        return;
      }

      setFilters(search, sort);
    },
    [setFilters],
  );

  return (
    <form className={clsx('col sm:row items-start gap-4 sm:items-center', className)} onChange={handleChange}>
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
          date <ArrowUpIcon className="fill-muted p-0.5" />
        </RadioItem>

        <RadioItem
          name="sort"
          id={Sort.dateDesc}
          title="Les plus récents en premier"
          defaultChecked={sort === Sort.dateDesc}
        >
          date <ArrowDownIcon className="fill-muted p-0.5" />
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
