import clsx from 'clsx';
import {
  selectThreadCommentsSearch,
  selectThreadCommentsSort,
  setThreadFilters,
  Sort,
} from 'frontend-domain';
import { FormEventHandler, useCallback } from 'react';
import { isSort } from 'shared';

import { Input } from '~/components/elements/input';
import { RadioItem, RadiosGroup } from '~/components/elements/radio-group';
import { ArrowDownIcon } from '~/components/icons/arrow-down';
import { ArrowUpIcon } from '~/components/icons/arrow-up';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

export type ThreadFiltersProps = {
  className?: string;
  threadId: string;
};

export const ThreadFilters = ({ className, threadId }: ThreadFiltersProps) => {
  const dispatch = useDispatch();

  const search = useSelector(selectThreadCommentsSearch, threadId);
  const sort = useSelector(selectThreadCommentsSort, threadId);

  const handleChange = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      const data = new FormData(event.currentTarget);

      const search = String(data.get('search'));
      const sort = String(data.get('sort'));

      if (!isSort(sort)) {
        console.warn(`invalid sort value "${sort}"`);
        return;
      }

      dispatch(setThreadFilters(threadId, { search, sort }));
    },
    [threadId, dispatch],
  );

  return (
    <form className={clsx('gap-4 items-center row', className)} onChange={handleChange}>
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
