import classNames from 'classnames';

import { FormError } from './field-error';

type InputProps = React.ComponentProps<'input'> & {
  error?: React.ReactNode;
};

export const Input = ({ className, error, ...props }: InputProps): JSX.Element => (
  <>
    <input className={classNames('py-0.5 px-1 rounded border border-light-gray', className)} {...props} />
    {error && <FormError>{error}</FormError>}
  </>
);
