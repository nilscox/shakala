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
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    disabled={loading ?? disabled}
    className={clsx(
      'button relative',
      primary && 'button-primary',
      secondary && 'button-secondary',
      small && 'text-xs',
      className
    )}
    {...props}
  >
    {children}
    {loading && <LoadingIndicator />}
  </button>
);

export const SubmitButton = (props: ButtonProps) => {
  return <Button type="submit" {...props} />;
};

const LoadingIndicator = () => {
  return <div className="absolute inset-y-0 animate-loading bg-neutral/20" />;
};
