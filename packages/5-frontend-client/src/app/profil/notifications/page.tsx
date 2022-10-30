import { setNotifications, setTotalNotifications } from 'frontend-domain';
import { headers } from 'next/headers';

import { api } from '../../../adapters';
import { Dispatch } from '../../dispatch';
import { ProfileTitle } from '../profile-title';

import { Notifications } from './notifications';

export default async function NotificationsPage() {
  const { userGateway } = api(headers().get('Cookie'));
  const notifications = await userGateway.listNotifications(1);

  return (
    <Dispatch actions={[setNotifications(notifications.items), setTotalNotifications(notifications.total)]}>
      <ProfileTitle title="Notifications" subTitle="Vos notifications" pageTitle="notifications" />
      <Notifications />
    </Dispatch>
  );
}
