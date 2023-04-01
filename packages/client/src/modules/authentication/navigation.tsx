import { SearchParamLink } from '~/elements/link';

import { AuthForm } from './types';
import { useAuthenticationForm } from './use-authentication-form';

export const AuthenticationNavigation = () => {
  const form = useAuthenticationForm();

  return (
    <nav className="links-nocolor flex flex-row justify-between gap-1 text-muted">
      {form !== AuthForm.signUp && (
        <SearchParamLink param="auth" value={AuthForm.signUp}>
          Créer un compte
        </SearchParamLink>
      )}

      {form !== AuthForm.signIn && (
        <SearchParamLink param="auth" value={AuthForm.signIn}>
          Connexion
        </SearchParamLink>
      )}

      {form !== AuthForm.emailLogin && (
        <SearchParamLink param="auth" value={AuthForm.emailLogin}>
          Mot de passe oublié
        </SearchParamLink>
      )}
    </nav>
  );
};
