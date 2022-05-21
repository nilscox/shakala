import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react';

type SetFieldError = (field: string, message: ReactNode) => void;
export type FieldErrorsHandler = (data: any, setError: SetFieldError) => void;

type SetFormError = (message: ReactNode | undefined) => void;
export type FormErrorHandler = (data: any, setError: SetFormError) => void;

type FieldErrorsAction =
  | { type: 'set'; field: string; message: ReactNode }
  | { type: 'clear'; field: string }
  | { type: 'clearAll' };

const fieldErrorsReducer = (state: Record<string, ReactNode>, action: FieldErrorsAction) => {
  if (action.type === 'set') {
    return { ...state, [action.field]: action.message };
  }

  if (action.type === 'clear') {
    const result = { ...state };

    delete result[action.field];

    return result;
  }

  if (action.type === 'clearAll') {
    return {};
  }

  return state;
};

export const useValidationErrors = (
  data: any,
  fieldErrorsHandler: FieldErrorsHandler,
  formErrorHandler: FormErrorHandler,
) => {
  const [fieldErrors, dispatch] = useReducer(fieldErrorsReducer, {});
  const [formError, setFormError] = useState<ReactNode>();

  useEffect(() => {
    if (!data) {
      return dispatch({ type: 'clearAll' });
    }

    fieldErrorsHandler(data, (field, message) => dispatch({ type: 'set', field, message }));
    formErrorHandler(data, setFormError);
  }, [data, fieldErrorsHandler, formErrorHandler]);

  const clearFieldError = useCallback((field: string) => dispatch({ type: 'clear', field }), []);
  const clearAllFieldErrors = useCallback(() => dispatch({ type: 'clearAll' }), []);
  const clearFormError = useCallback(() => setFormError(undefined), []);

  const clearAllFormErrors = useCallback(() => {
    clearAllFieldErrors();
    clearFormError();
  }, [clearAllFieldErrors, clearFormError]);

  return [
    formError,
    fieldErrors,
    {
      clearFieldError,
      clearAllFieldErrors,
      clearFormError,
      clearAllFormErrors,
    },
  ] as const;
};
