import { NotImplemented } from '~/app/not-implemented';

import { ProfileTitle } from '../profile-title';

export { ProfileLayout as Layout } from '../profile-layout';
export { TimelinePage as Page };
export const authenticationRequired = true;

const TimelinePage = () => (
  <>
    <ProfileTitle
      title="Timeline"
      subTitle="L'activité de votre compte au cours du temps"
      pageTitle="timeline"
    />

    <NotImplemented />
  </>
);
