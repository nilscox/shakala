import { AuthenticationType } from 'frontend-domain';

import { Link } from '~/components/elements/link';

import { useAuthenticationForm } from './use-authentication-form';

export const AuthenticationMessage = () => {
  const form = useAuthenticationForm();

  if (form === AuthenticationType.login) {
    return <p>Connectez-vous sur Shakala pour interagir avec le reste de la communauté.</p>;
  }

  if (form === AuthenticationType.signup) {
    return (
      <p>
        Créez votre compte sur Shakala. Vos <Link href="/faq#donnes-personnelles">données personnelles</Link>{' '}
        ne seront pas communiquées en dehors de la plateforme.
      </p>
    );
  }

  if (form === AuthenticationType.emailLogin) {
    return <p>Identifiez-vous sur Shakala via un email contenant un lien de connexion sans mot de passe.</p>;
  }

  return null;
};
