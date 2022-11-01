import { AuthenticationType } from 'frontend-domain';

import { SearchParamLink } from '~/elements/search-param-link';

import { useAuthenticationForm } from './use-authentication-form';

export const AuthenticationNavigation = () => {
  const form = useAuthenticationForm();

  return (
    <nav className="links-nocolor flex flex-row justify-between gap-1 text-muted">
      {form !== AuthenticationType.signup && (
        <SearchParamLink param="auth" value="register">
          Créer un compte
        </SearchParamLink>
      )}

      {form !== AuthenticationType.login && (
        <SearchParamLink param="auth" value="login">
          Connexion
        </SearchParamLink>
      )}

      {form !== AuthenticationType.emailLogin && (
        <SearchParamLink param="auth" value="email-login">
          Mot de passe oublié
        </SearchParamLink>
      )}
    </nav>
  );
};
