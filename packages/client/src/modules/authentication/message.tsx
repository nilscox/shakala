import { Link } from '~/elements/link';

import { AuthForm } from './types';
import { useAuthenticationForm } from './use-authentication-form';

export const AuthenticationMessage = () => {
  const form = useAuthenticationForm();

  if (form === AuthForm.signIn) {
    return <p>Connectez-vous sur Shakala pour interagir avec le reste de la communauté.</p>;
  }

  if (form === AuthForm.signUp) {
    return (
      <p>
        Créez votre compte sur Shakala. Vos <Link href="/faq#donnes-personnelles">données personnelles</Link>{' '}
        ne seront pas communiquées en dehors de la plateforme.
      </p>
    );
  }

  if (form === AuthForm.emailLogin) {
    return <p>Identifiez-vous sur Shakala via un email contenant un lien de connexion sans mot de passe.</p>;
  }

  return null;
};
