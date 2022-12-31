import { userActivityActions } from '@shakala/frontend-domain';

import { ProfileTitle } from '~/app/profile/profile-title';
import { UserActivities } from '~/app/user-activities/user-activities';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr.authenticated(async (store) => {
  await store.dispatch(userActivityActions.fetchActivities(1));
});

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
