import { clsx } from 'clsx';
import { cloneElement, ReactElement, ReactNode } from 'react';

export type FormFieldProps = {
  className?: string;
  name?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  errorsMap?: Record<string, ReactNode>;
  consistentErrorHeight?: boolean;
  children: ReactNode;
  after?: ReactNode;
};

export const FormField = ({
  className,
  name,
  label,
  description,
  error,
  errorsMap,
  consistentErrorHeight = true,
  children,
  after,
}: FormFieldProps) => (
  <div className={className}>
    {label && (
      <div>
        <label htmlFor={name} className="font-semibold text-muted">
          {label}
        </label>
        {description && <span className="text-xs text-muted"> - {description}</span>}
      </div>
    )}

    <Field name={name} error={error} after={after}>
      {children}
    </Field>

    {error && <FieldError id={`${name}-error`} error={error} errorsMap={errorsMap} />}
    {!error && consistentErrorHeight && <div>&nbsp;</div>}
  </div>
);

type FieldProps = Pick<FormFieldProps, 'name' | 'error' | 'children' | 'after'>;

const Field = ({ name, error, children, after }: FieldProps) => {
  const field = cloneElement(children as ReactElement, {
    name,
    id: name,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${name}-error` : undefined,
    'aria-errormessage': error ? `${name}-error` : undefined,
  });

  if (!after) {
    return field;
  }

  return (
    <div className="row">
      {field}
      {after}
    </div>
  );
};

const getError = (error?: unknown, errorsMap?: Record<string, ReactNode>) => {
  if (!error) {
    return;
  }

  if (typeof error !== 'string') {
    return;
  }

  if (!errorsMap) {
    return error;
  }

  return errorsMap[error];
};

type FieldErrorProps = {
  id?: string;
  className?: string;
  error?: string;
  errorsMap?: Record<string, React.ReactNode>;
  children?: React.ReactNode;
};

export const FieldError = ({ id, className, error, errorsMap, children }: FieldErrorProps) => (
  <div id={id} className={clsx('text-xs font-bold text-error', className)}>
    {getError(error, errorsMap) ?? children}
  </div>
);
