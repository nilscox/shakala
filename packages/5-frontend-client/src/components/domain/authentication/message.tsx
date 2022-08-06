import { AuthenticationType, selectAuthenticationForm } from 'frontend-domain';
import { Link } from 'react-router-dom';

import { useSelector } from '~/hooks/use-selector';

export const AuthenticationMessage = () => {
  const form = useSelector(selectAuthenticationForm);

  if (form === AuthenticationType.login) {
    return <p>Connectez-vous sur Shakala pour interagir avec le reste de la communauté.</p>;
  }

  if (form === AuthenticationType.signup) {
    return (
      <div>
        <p>
          Créez votre compte sur Shakala. Vos <Link to="/faq#donnes-personnelles">données personnelles</Link>{' '}
          ne seront pas communiquées en dehors de la plateforme.
        </p>
        <p className="text-sm">
          Attention : les données sont pour l'instant éphémères. Lorsque le serveur sera redémarré (quelques
          semaines max), votre compte et les message que vous aurez créé n'existeront plus.
        </p>
      </div>
    );
  }

  if (form === AuthenticationType.emailLogin) {
    return <p>Identifiez-vous sur Shakala via un email contenant un lien de connexion sans mot de passe.</p>;
  }

  return null;
};
