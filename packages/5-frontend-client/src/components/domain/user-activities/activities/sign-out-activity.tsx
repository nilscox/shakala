import { AuthenticationActivityType } from 'shared';

import IconSignOut from '~/icons/sign-out.svg';

import { Activity, ActivityItem } from '../user-activity';

export const SignOutActivity: ActivityItem<AuthenticationActivityType.signOut> = ({ activity }) => (
  <Activity activity={activity} icon={<IconSignOut />}>
    <p>Vous vous êtes déconnecté·e.</p>
  </Activity>
);
