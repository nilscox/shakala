import { SearchParamLink } from '~/components/elements/search-param-link';

import { AuthenticationFormType, useAuthenticationFormType } from './use-authentication-form-type';

export const AuthenticationNavigation = () => {
  const form = useAuthenticationFormType();

  return (
    <nav className="flex flex-row justify-between text-text-light links-nocolor links-underline-hover">
      {form !== AuthenticationFormType.signup && (
        <SearchParamLink param="auth" value="signup">
          Créer un compte
        </SearchParamLink>
      )}

      {form !== AuthenticationFormType.login && (
        <SearchParamLink param="auth" value="login">
          Connexion
        </SearchParamLink>
      )}

      {form !== AuthenticationFormType.emailLogin && (
        <SearchParamLink param="auth" value="email-login">
          Mot de passe oublié
        </SearchParamLink>
      )}
    </nav>
  );
};
