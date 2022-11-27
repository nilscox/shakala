import { AuthenticationFormType } from 'frontend-domain';

import { SearchParamLink } from '~/elements/search-param-link';

import { useAuthenticationForm } from './use-authentication-form';

export const AuthenticationNavigation = () => {
  const form = useAuthenticationForm();

  return (
    <nav className="links-nocolor flex flex-row justify-between gap-1 text-muted">
      {form !== AuthenticationFormType.signup && (
        <SearchParamLink param="auth" value={AuthenticationFormType.signup}>
          Créer un compte
        </SearchParamLink>
      )}

      {form !== AuthenticationFormType.login && (
        <SearchParamLink param="auth" value={AuthenticationFormType.login}>
          Connexion
        </SearchParamLink>
      )}

      {form !== AuthenticationFormType.emailLogin && (
        <SearchParamLink param="auth" value={AuthenticationFormType.emailLogin}>
          Mot de passe oublié
        </SearchParamLink>
      )}
    </nav>
  );
};
