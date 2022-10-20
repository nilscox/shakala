import { ProfileActivityType } from 'shared';

import IconValidateEmail from '~/icons/validate-email.svg';

import { Activity, ActivityItem } from '../user-activity';

export const EmailAddressValidatedActivity: ActivityItem<ProfileActivityType.emailAddressValidated> = ({
  activity,
}) => (
  <Activity activity={activity} icon={<IconValidateEmail />}>
    <p>Vous avez validé votre adresse email.</p>
  </Activity>
);
