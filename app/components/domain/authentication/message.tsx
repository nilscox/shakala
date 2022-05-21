import { Link } from 'react-router-dom';

import { AuthenticationFormType, useAuthenticationFormType } from './use-authentication-form-type';

export const AuthenticationMessage = () => {
  const form = useAuthenticationFormType();

  if (form === AuthenticationFormType.login) {
    return <>Connectez-vous sur Shakala pour interagir avec le reste de la communauté.</>;
  }

  if (form === AuthenticationFormType.signup) {
    return (
      <>
        Créez votre compte sur Shakala. Vos <Link to="/faq#donnes-personnelles">données personnelles</Link> ne
        seront pas communiquées en dehors de la plateforme.
      </>
    );
  }

  if (form === AuthenticationFormType.emailLogin) {
    return <>Identifiez-vous sur Shakala via un email contenant un lien de connexion sans mot de passe.</>;
  }

  return null;
};
