import { AuthenticationType } from 'frontend-domain';
import { useEffect } from 'react';

import { useSearchParam, useSetSearchParam } from '~/hooks/use-search-param';

export const useAuthenticationForm = (): AuthenticationType => {
  const auth = useSearchParam('auth');
  const setSearchParam = useSetSearchParam();

  useEffect(() => {
    if (!auth || !map[auth]) {
      console.warn(
        `the "auth" search param (${auth}) is invalid, replacing it with "${AuthenticationType.login}"`,
      );

      setSearchParam('auth', AuthenticationType.login);
    }
  }, [auth, setSearchParam]);

  if (!auth || !map[auth]) {
    return AuthenticationType.login;
  }

  return map[auth];
};

const map: Record<string, AuthenticationType> = {
  'email-login': AuthenticationType.emailLogin,
  login: AuthenticationType.login,
  register: AuthenticationType.signup,
};
