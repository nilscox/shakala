import classNames from 'classnames';

import { FormError } from './field-error';

export type InputProps = React.ComponentProps<'input'> & {
  error?: React.ReactNode;
};

export const Input = ({ className, error, ...props }: InputProps): JSX.Element => (
  <div>
    <input className={classNames('py-0.5 px-1 rounded border', className)} {...props} />
    {error && <FormError className="mt-0.5">{error}</FormError>}
  </div>
);
