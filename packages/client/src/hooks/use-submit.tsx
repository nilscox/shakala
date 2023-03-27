import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

import { ValidationErrors } from '../utils/validation-errors';

type UseSubmitOptions<Result> = {
  onSuccess?: (result: Result) => void;
};

export const useSubmit = <Values extends FieldValues, Result>(
  form: UseFormReturn<Values>,
  submit: (values: Values) => Promise<Result>,
  options?: UseSubmitOptions<Result>
): SubmitHandler<Values> => {
  return async (values: Values) => {
    try {
      options?.onSuccess?.(await submit(values));
    } catch (error) {
      if (error instanceof ValidationErrors) {
        error.setFormErrors(form);
        return;
      }

      throw error;
    }
  };
};
