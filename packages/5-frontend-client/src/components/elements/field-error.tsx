import classNames from 'classnames';

type FormErrorProps = {
  className?: string;
  children: React.ReactNode;
};

export const FormError = ({ className, children }: FormErrorProps) => {
  return <div className={classNames('text-sm font-bold text-error', className)}>{children}</div>;
};
