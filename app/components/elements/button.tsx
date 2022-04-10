import classNames from 'classnames';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  small?: boolean;
};

export const Button = ({ small, className, ...props }: ButtonProps) => (
  <button className={classNames('button', className, small && 'text-sm')} {...props} />
);
