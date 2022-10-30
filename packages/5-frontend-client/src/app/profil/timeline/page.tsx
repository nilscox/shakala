import { ProfileTitle } from '../profile-title';

import { UserActivities } from './user-activities';

const TimelinePage = () => (
  <>
    <ProfileTitle
      title="Timeline"
      subTitle="L'activité de votre compte au cours du temps"
      pageTitle="timeline"
    />
    <UserActivities />
  </>
);

export default TimelinePage;
