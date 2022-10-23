import { UserActivities } from '~/components/domain/user-activities/user-activities';

import { ProfileTitle } from './profile-title';

export const TimelineRoute = () => (
  <div>
    <ProfileTitle
      title="Timeline"
      subTitle="L'activité de votre compte au cours du temps"
      pageTitle="timeline"
    />
    <UserActivities />
  </div>
);