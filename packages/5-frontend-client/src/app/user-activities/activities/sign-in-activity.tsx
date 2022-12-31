import { AuthenticationActivityType, AuthenticationMethod } from '@shakala/shared';

import IconSignIn from '~/icons/sign-in.svg';

import { Activity, ActivityItem } from '../user-activity';

export const SignInActivity: ActivityItem<AuthenticationActivityType.signIn> = ({ activity }) => (
  <Activity activity={activity} icon={<IconSignIn />}>
    <p
      title={
        activity.payload.method === AuthenticationMethod.emailPassword
          ? 'Connection via email / mot de passe'
          : 'Connection via un lien envoyé par mail'
      }
    >
      Vous vous êtes connecté·e.
    </p>
  </Activity>
);
