import classNames from 'classnames';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean;
  small?: boolean;
  loading?: boolean;
};

export const Button = ({ primary, small, loading, className, children, ...props }: ButtonProps) => (
  <button
    className={classNames('button relative', primary && 'button-primary', small && 'text-sm', className)}
    {...props}
  >
    {children}
    {loading && <LoadingIndicator />}
  </button>
);

const LoadingIndicator = () => {
  return <div className="absolute inset-y-0 right-0 bg-white/20 animate-loading" />;
};
