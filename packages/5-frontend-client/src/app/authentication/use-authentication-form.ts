import { AuthenticationFormType, authenticationSelectors } from 'frontend-domain';
import { useDebounce } from 'use-debounce';

import { useAppSelector } from '~/hooks/use-app-selector';

export const useAuthenticationForm = (): AuthenticationFormType | undefined => {
  const auth = useAppSelector(authenticationSelectors.currentForm);
  const [authDebounced] = useDebounce(auth, 200);

  if (auth) {
    return auth;
  }

  return authDebounced;
};
