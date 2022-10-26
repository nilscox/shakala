import { Notifications } from '../../components/domain/notifications/notifications';

import { ProfileTitle } from './profile-title';

export const NotificationsRoute = () => {
  return (
    <div>
      <ProfileTitle title="Notifications" subTitle="Vos notifications" pageTitle="notifications" />
      <Notifications />
    </div>
  );
};
