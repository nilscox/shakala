import { UserActivityType } from '@shakala/shared';

import IconValidateEmail from '~/icons/validate-email.svg';

import { Activity, ActivityItem } from '../user-activity';

export const EmailAddressValidatedActivity: ActivityItem<UserActivityType.emailAddressValidated> = (
  props
) => (
  <Activity icon={<IconValidateEmail />} {...props}>
    <p>Vous avez validé votre adresse email.</p>
  </Activity>
);
