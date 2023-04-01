import { NotImplemented } from '~/app/not-implemented';

import { ProfileTitle } from '../profile-title';

export { ProfileLayout as Layout } from '../profile-layout';
export { NotificationPage as Page };
export const authenticationRequired = true;

const NotificationPage = () => (
  <>
    <ProfileTitle title="Notifications" subTitle="Vos notifications" pageTitle="notifications" />
    <NotImplemented />
  </>
);
