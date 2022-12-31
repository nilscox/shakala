import { Notification, notificationActions, notificationSelectors } from '@shakala/frontend-domain';
import { NotificationType } from '@shakala/shared';
import { useState } from 'react';

import { InfiniteScroll } from '~/elements/infinite-scroll';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';

import { NotificationItem } from './notification';
import { notificationComponentMap } from './notification-items';

export const Notifications = () => {
  const dispatch = useAppDispatch();

  const notifications = useAppSelector(notificationSelectors.list);
  const hasMoreNotifications = useAppSelector(notificationSelectors.hasMore);
  const isLoadingNotifications = useAppSelector(notificationSelectors.isFetching);

  const [page, setPage] = useState(1);

  const renderNotification = <Type extends NotificationType>(
    notification: Notification<Type>,
    index: number,
  ) => {
    const Component = notificationComponentMap[notification.type] as NotificationItem<Type>;

    return <Component key={index} notification={notification} />;
  };

  const handleLoadMore = () => {
    dispatch(notificationActions.fetchNotifications(page + 1));
    setPage(page + 1);
  };

  return (
    <div className="col gap-4">
      <InfiniteScroll
        items={notifications}
        hasMore={hasMoreNotifications}
        loading={isLoadingNotifications}
        loadMore={handleLoadMore}
        loaderClassName="ml-2"
      >
        {renderNotification}
      </InfiniteScroll>
    </div>
  );
};
