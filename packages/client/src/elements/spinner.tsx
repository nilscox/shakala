import clsx from 'clsx';

type SpinnerProps = {
  className?: string;
};

export const Spinner = ({ className }: SpinnerProps) => (
  <div
    className={clsx(
      'box-border inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-b-transparent',
      className
    )}
  />
);
