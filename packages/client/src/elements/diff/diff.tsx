import clsx from 'clsx';

type DiffProps = {
  className?: string;
  before: string;
  after: string;
};

export const Diff = ({ className, before, after }: DiffProps) => (
  <div className={clsx('row divide-x', className)}>
    <div className="flex-1 px-2" dangerouslySetInnerHTML={{ __html: before }} />
    <div className="flex-1 px-2" dangerouslySetInnerHTML={{ __html: after }} />
  </div>
);
