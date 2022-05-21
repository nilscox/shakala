import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce } from '~/hooks/use-debounce';

export enum AuthenticationFormType {
  login = 'login',
  signup = 'signup',
  emailLogin = 'email-login',
}

export const useAuthenticationFormType = (): AuthenticationFormType | null => {
  const closeForm = useCloseAuthenticationForm();

  const [params] = useSearchParams();
  const form = params.get('auth') as AuthenticationFormType | null;

  const debouncedForm = useDebounce(form, 200);

  const isValidFormType = form && ['login', 'signup', 'email-login'].includes(form);

  useEffect(() => {
    if (!isValidFormType) {
      closeForm();
    }
  }, [isValidFormType, closeForm]);

  if (!isValidFormType) {
    return debouncedForm;
  }

  return form ?? debouncedForm;
};

export const useCloseAuthenticationForm = () => {
  const [params, setSearchParams] = useSearchParams();

  return useCallback(() => {
    params.delete('auth');
    params.delete('next');

    setSearchParams(params, { state: { scroll: false } });
  }, [params, setSearchParams]);
};
