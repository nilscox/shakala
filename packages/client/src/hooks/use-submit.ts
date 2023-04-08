import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

import { ValidationErrors } from '../utils/validation-errors';

import { useErrorHandler } from './use-error-handler';

type UseSubmitOptions<Result> = {
  onSuccess?: (result: Result) => void;
  onError?: (error: Error) => void;
};

export const useSubmit = <Values extends FieldValues, Result>(
  form: UseFormReturn<Values>,
  submit: (values: Values) => Promise<Result>,
  options?: UseSubmitOptions<Result>
): SubmitHandler<Values> => {
  const handleError = useErrorHandler();

  return async (values: Values) => {
    try {
      const result = await submit(values);

      options?.onSuccess?.(result);
    } catch (error) {
      if (error instanceof ValidationErrors) {
        error.setFormErrors(form);
        return;
      }

      if (options?.onError && error instanceof Error) {
        try {
          options.onError(error);
        } catch (error) {
          handleError(error);
        }
      } else {
        handleError(error);
      }
    }
  };
};
