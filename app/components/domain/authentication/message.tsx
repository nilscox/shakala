import { Link } from 'react-router-dom';

import { AuthenticationFormType } from './authentication-form';

type AuthenticationMessageProps = {
  form: AuthenticationFormType;
};

export const AuthenticationMessage = ({ form }: AuthenticationMessageProps) => {
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

  throw new Error(`AuthenticationForm message: invalid form type "${form}"`);
};
