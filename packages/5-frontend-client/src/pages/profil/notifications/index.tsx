import { Notifications } from '~/app/notifications/notifications';
import { ProfileTitle } from '~/app/profile/profile-title';

export default async function NotificationsPage() {
  const notifications = await userGateway.listNotifications(1);

  return (
    <>
      <ProfileTitle title="Notifications" subTitle="Vos notifications" pageTitle="notifications" />
      <Notifications />
    </>
  );
}
