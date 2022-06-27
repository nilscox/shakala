import clsx from 'clsx';

type FormErrorProps = {
  className?: string;
  children: React.ReactNode;
};

export const FormError = ({ className, children }: FormErrorProps) => {
  return <div className={clsx('text-sm font-bold text-error', className)}>{children}</div>;
};
