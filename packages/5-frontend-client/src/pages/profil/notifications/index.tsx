import { notificationActions } from 'frontend-domain';
import { useEffect } from 'react';

import { Notifications } from '~/app/notifications/notifications';
import { ProfileTitle } from '~/app/profile/profile-title';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr.authenticated(async (store) => {
  await store.dispatch(notificationActions.fetchNotifications(1));
});

const NotificationsPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(notificationActions.fetchNotifications(1));
  }, [dispatch]);

  return (
    <>
      <ProfileTitle title="Notifications" subTitle="Vos notifications" pageTitle="notifications" />
      <Notifications />
    </>
  );
};

export default NotificationsPage;
