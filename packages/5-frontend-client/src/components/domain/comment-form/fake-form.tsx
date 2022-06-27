import clsx from 'clsx';

import { Avatar } from '../../elements/avatar/avatar';

type FakeFormProps = {
  className?: string;
  onFocus: () => void;
};

export const FakeForm = ({ className, onFocus }: FakeFormProps) => (
  <form className={clsx('gap-1 items-center p-2 row', className)}>
    <Avatar />
    <input readOnly className="py-0.5 px-1 w-full rounded border" placeholder="Répondre" onFocus={onFocus} />
  </form>
);
