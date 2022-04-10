import classNames from 'classnames';

type SelectProps = React.ComponentProps<'select'>;

export const Select = ({ className, ...props }: SelectProps): JSX.Element => (
  <select className={classNames('py-0.5 px-1 bg-transparent cursor-pointer', className)} {...props} />
);
