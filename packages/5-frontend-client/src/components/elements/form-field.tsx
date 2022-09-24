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
}: FormFieldProps) => (
  <div className={className}>
    {label && (
      <div>
        <label htmlFor={name} className="font-semibold">
          {label}
        </label>
        {description && <span className="text-xs text-muted"> - {description}</span>}
      </div>
    )}

    {cloneElement(children as ReactElement, {
      name,
      id: name,
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `${name}-error` : undefined,
      'aria-errormessage': error ? `${name}-error` : undefined,
    })}

    {(error || consistentErrorHeight) && (
      <FieldError id={`${name}-error`}>{getError(error, errorsMap) || <>&nbsp;</>}</FieldError>
    )}
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
  <div id={id} className={clsx('text-xs font-bold text-error', className)}>
    {children}
  </div>
);
