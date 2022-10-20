import { AuthenticationActivityType } from 'shared';

import IconSignUp from '~/icons/sign-up.svg';

import { Activity, ActivityItem } from '../user-activity';

export const SignUpActivity: ActivityItem<AuthenticationActivityType.signUp> = ({ activity }) => (
  <Activity activity={activity} icon={<IconSignUp />}>
    <p>Vous avez créé votre compte sur Shakala.</p>
  </Activity>
);
