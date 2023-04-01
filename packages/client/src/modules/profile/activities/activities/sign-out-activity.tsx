import { UserActivityType } from '@shakala/shared';

import IconSignOut from '~/icons/sign-out.svg';

import { Activity, ActivityItem } from '../user-activity';

export const SignOutActivity: ActivityItem<UserActivityType.signOut> = (props) => (
  <Activity icon={<IconSignOut />} {...props}>
    <p>Vous vous êtes déconnecté·e.</p>
  </Activity>
);
