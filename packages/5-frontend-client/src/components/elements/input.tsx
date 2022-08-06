import clsx from 'clsx';

import { FieldError } from './form-field';

// todo: remove error
export type InputProps = React.ComponentProps<'input'> & {
  error?: React.ReactNode;
};

export const Input = ({ className, error, ...props }: InputProps): JSX.Element => (
  <>
    <input className={clsx('py-0.5 px-1 rounded border', className)} {...props} />
    {error && <FieldError className="mt-0.5">{error}</FieldError>}
  </>
);
