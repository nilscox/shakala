import clsx from 'clsx';
import { ReactNode, ReactElement, cloneElement } from 'react';

type FormFieldProps = {
  name?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  errorsMap?: Record<string, ReactNode>;
  children: ReactElement;
};

export const FormField = ({ name, label, description, error, errorsMap, children }: FormFieldProps) => (
  <div>
    {label && (
      <div>
        <label htmlFor={name} className="font-semibold">
          {label}
        </label>
        {description && <span className="text-sm text-muted"> - {description}</span>}
      </div>
    )}

    {cloneElement(children, {
      name,
      id: name,
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `${name}-error` : undefined,
      'aria-errormessage': error ? `${name}-error` : undefined,
    })}

    <FieldError id={`${name}-error`}>{getError(error, errorsMap) || <>&nbsp;</>}</FieldError>
  </div>
);

const getError = (error?: string, errorsMap?: Record<string, ReactNode>) => {
  if (!error) {
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
  children: React.ReactNode;
};

export const FieldError = ({ id, className, children }: FieldErrorProps) => (
  <div id={id} className={clsx('text-sm font-bold text-error', className)}>
    {children}
  </div>
);
