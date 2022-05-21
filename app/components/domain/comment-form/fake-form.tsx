import classNames from 'classnames';

import { Avatar } from '../avatar/avatar';

type FakeFormProps = {
  className?: string;
  onFocus: () => void;
};

export const FakeForm = ({ className, onFocus }: FakeFormProps) => (
  <form className={classNames('flex flex-row gap-1 items-center p-2', className)}>
    <Avatar />
    <input
      readOnly
      className="py-0.5 px-1 w-full rounded border border-light-gray"
      placeholder="Répondre"
      onFocus={onFocus}
    />
  </form>
);
