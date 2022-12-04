import { ValidationErrors } from 'frontend-domain';
import { useCallback } from 'react';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export const useFormSubmit = <Form extends FieldValues, Result>(
  submit: (form: Form) => Result,
  setError: UseFormSetError<Form>,
  onUnhandled?: (error: unknown) => void,
  deps: React.DependencyList = [],
) => {
  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ValidationErrors) {
        for (const field of error.getFields()) {
          const message = error.getFieldError(field);

          if (message) {
            setError(field as Path<Form>, { message });
          }
        }
      } else {
        onUnhandled?.(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setError, ...deps],
  );

  return useCallback(
    async (form: Form) => {
      try {
        await submit(form);
      } catch (error) {
        handleError(error);
      }
    },
    [submit, handleError],
  );
};
