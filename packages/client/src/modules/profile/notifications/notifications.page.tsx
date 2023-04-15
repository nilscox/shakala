import { useState } from 'react';

import { Fallback } from '~/elements/fallback';
import { useQuery } from '~/hooks/use-query';
import { prefetchQuery } from '~/utils/prefetch-query';
import { withSuspense } from '~/utils/with-suspense';

import { ProfileTitle } from '../profile-title';

import { Notifications } from './notifications';

export { ProfileLayout as Layout } from '../profile-layout';
export { NotificationPage as Page };
export const authenticationRequired = true;

export const queries = [prefetchQuery(TOKENS.account, 'getNotifications', 1)];

const NotificationPage = () => (
  <>
    <ProfileTitle title="Notifications" subTitle="Vos notifications" pageTitle="notifications" />
    <NotificationsList />
  </>
);

const NotificationsList = withSuspense(() => {
  const [page, setPage] = useState(1);
  const { items: notifications, total } = useQuery(TOKENS.account, 'getNotifications', page);

  if (notifications.length === 0) {
    return <NoNotifications />;
  }

  return (
    <Notifications
      notifications={notifications}
      hasMore={notifications.length < total}
      loadMore={() => setPage(page + 1)}
    />
  );
}, 'NotificationsList');

const NoNotifications = () => {
  return <Fallback>Vous n'avez pas encore reçu de notification.</Fallback>;
};
