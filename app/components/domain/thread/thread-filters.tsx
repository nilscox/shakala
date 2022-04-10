import cx from 'classnames';

import { Input } from '~/components/elements/input';
import { Select } from '~/components/elements/select';
import { Sort } from '~/types';

type ThreadFiltersProps = {
  className?: string;
  search: string;
  onSearch: (search: string) => void;
  sort: Sort;
  onSort: (sort: Sort) => void;
};

export const ThreadFilters = ({
  className,
  search,
  onSearch,
  sort,
  onSort,
}: ThreadFiltersProps): JSX.Element => {
  return (
    <div className={cx('flex flex-row items-center gap-4', className)}>
      <Input
        type="search"
        placeholder="Rechercher..."
        className="flex-1 py-1 px-2 rounded border border-light-gray/60"
        value={search}
        onTextChange={onSearch}
      />

      <label className="text-text-light">
        Trier par :
        <Select
          className="ml-2 text-text"
          value={sort}
          onChange={(event) => onSort(event.currentTarget.value as Sort)}
        >
          <option>pertinence</option>
          <option>date</option>
        </Select>
      </label>
    </div>
  );
};
