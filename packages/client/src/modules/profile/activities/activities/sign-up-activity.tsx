import { UserActivityType } from '@shakala/shared';

import IconSignUp from '~/icons/sign-up.svg';

import { Activity, ActivityItem } from '../user-activity';

export const SignUpActivity: ActivityItem<UserActivityType.signUp> = (props) => (
  <Activity icon={<IconSignUp />} {...props}>
    <p>Vous avez créé votre compte sur Shakala.</p>
  </Activity>
);
