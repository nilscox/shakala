import { Form, useSearchParams, useSubmit } from '@remix-run/react';
import cx from 'classnames';

import { Input } from '~/components/elements/input';
import { Select } from '~/components/elements/select';
import { Sort } from '~/types';

export type ThreadFiltersProps = {
  className?: string;
};

export const ThreadFilters = ({ className }: ThreadFiltersProps) => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  return (
    <Form
      method="get"
      className={cx('flex flex-row items-center gap-4', className)}
      onChange={(e) => submit(e.currentTarget)}
    >
      <Input
        type="search"
        name="search"
        placeholder="Rechercher..."
        className="flex-1 py-1 px-2 rounded border border-light-gray/60"
        defaultValue={searchParams.get('search') ?? ''}
      />

      <label className="text-text-light">
        Trier par :
        <Select
          name="sort"
          className="ml-2 text-text"
          defaultValue={searchParams.get('sort') ?? Sort.relevance}
        >
          <option value={Sort.relevance}>pertinence</option>
          <option value={Sort.date}>date</option>
        </Select>
      </label>
    </Form>
  );
};
