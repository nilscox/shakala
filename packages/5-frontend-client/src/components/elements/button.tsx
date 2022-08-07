import { clsx } from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean;
  secondary?: boolean;
  small?: boolean;
  loading?: boolean;
};

export const Button = ({
  primary,
  secondary,
  small,
  loading,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    className={clsx(
      'relative button',
      primary && 'button-primary',
      secondary && 'button-secondary',
      small && 'text-sm',
      className,
    )}
    {...props}
  >
    {children}
    {loading && <LoadingIndicator />}
  </button>
);

const LoadingIndicator = () => {
  return <div className="absolute inset-y-0 right-0 bg-neutral/20 animate-loading" />;
};
