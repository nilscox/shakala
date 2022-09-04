import { clsx } from 'clsx';

type SelectProps = React.ComponentProps<'select'>;

export const Select = ({ className, ...props }: SelectProps): JSX.Element => (
  <select className={clsx('cursor-pointer bg-transparent py-0.5 px-1', className)} {...props} />
);
