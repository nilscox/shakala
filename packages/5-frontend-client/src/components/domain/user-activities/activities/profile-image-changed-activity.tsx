import { ProfileActivityType } from 'shared';

import IconCamera from '~/icons/camera.svg';

import { Activity, ActivityItem } from '../user-activity';

export const ProfileImageChangedActivity: ActivityItem<ProfileActivityType.profileImageChanged> = ({
  activity,
}) => (
  <Activity activity={activity} icon={<IconCamera />}>
    <p>Vous avez changé votre image de profile.</p>
  </Activity>
);
