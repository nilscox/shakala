import { AuthenticationType, selectAuthenticationForm } from 'frontend-domain';

import { SearchParamLink } from '~/components/elements/search-param-link';
import { useSelector } from '~/hooks/use-selector';

export const AuthenticationNavigation = () => {
  const form = useSelector(selectAuthenticationForm);

  return (
    <nav className="flex flex-row gap-1 justify-between text-muted links-nocolor">
      {form !== AuthenticationType.signup && (
        <SearchParamLink param="auth" value="signup">
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
