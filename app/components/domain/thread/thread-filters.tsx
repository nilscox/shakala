import { Form, useSearchParams, useSubmit } from '@remix-run/react';
import classNames from 'classnames';

import { Input } from '~/components/elements/input';
import { RadioItem, RadiosGroup } from '~/components/elements/radio-group';
import { ArrowDownIcon } from '~/components/icons/arrow-down';
import { ArrowUpIcon } from '~/components/icons/arrow-up';
import { Sort } from '~/types';

export type ThreadFiltersProps = {
  className?: string;
};

export const ThreadFilters = ({ className }: ThreadFiltersProps) => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get('sort');

  return (
    <Form
      method="get"
      className={classNames('flex flex-row items-center gap-4', className)}
      onChange={(e) => submit(e.currentTarget)}
    >
      <Input
        type="search"
        name="search"
        placeholder="Rechercher..."
        className="w-full"
        defaultValue={searchParams.get('search') ?? ''}
      />

      <RadiosGroup className="text-text-light">
        <RadioItem
          name="sort"
          id={Sort.dateAsc}
          title="Les plus anciens en premier"
          defaultChecked={sort === Sort.dateAsc}
        >
          date <ArrowUpIcon className="p-0.5 fill-text-light" />
        </RadioItem>

        <RadioItem
          name="sort"
          id={Sort.dateDesc}
          title="Les plus récents en premier"
          defaultChecked={sort === Sort.dateDesc}
        >
          date <ArrowDownIcon className="p-0.5 fill-text-light" />
        </RadioItem>

        <RadioItem
          name="sort"
          id={Sort.relevance}
          title="Les plus upvotés en premier"
          defaultChecked={sort ? sort === Sort.relevance : true}
        >
          pertinence
        </RadioItem>
      </RadiosGroup>
    </Form>
  );
};
