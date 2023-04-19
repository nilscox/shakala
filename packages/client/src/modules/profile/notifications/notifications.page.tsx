import { TOKENS } from '~/app/tokens';
import { Fallback } from '~/elements/fallback';
import { usePaginatedQuery } from '~/hooks/use-query';
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
  const [notifications, { hasMore, loadMore }] = usePaginatedQuery(
    TOKENS.account,
    'getNotifications',
    (page) => [page] as [number]
  );

  if (notifications.length === 0) {
    return <NoNotifications />;
  }

  return <Notifications notifications={notifications} hasMore={hasMore} loadMore={loadMore} />;
}, 'NotificationsList');

const NoNotifications = () => {
  return <Fallback>Vous n'avez pas encore reçu de notification.</Fallback>;
};
