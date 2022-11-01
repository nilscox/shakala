'use client';

import {
  fetchNotifications,
  Notification,
  selectHasMoreNotifications,
  selectIsLoadingNotifications,
  selectNotifications,
} from 'frontend-domain';
import { useState } from 'react';
import { NotificationType } from 'shared';

import { useSelector } from '~/hooks/use-selector';

import { InfiniteScroll } from '../../../components/elements/infinite-scroll/infinite-scroll';
import { useDispatch } from '../../../hooks/use-dispatch';

import { NotificationItem } from './notification';
import { notificationComponentMap } from './notification-items';

export const Notifications = () => {
  const dispatch = useDispatch();

  const notifications = useSelector(selectNotifications);
  const hasMoreNotifications = useSelector(selectHasMoreNotifications);
  const isLoadingNotifications = useSelector(selectIsLoadingNotifications);

  const [page, setPage] = useState(1);

  const renderNotification = <Type extends NotificationType>(
    notification: Notification<Type>,
    index: number,
  ) => {
    const Component = notificationComponentMap[notification.type] as NotificationItem<Type>;

    return <Component key={index} notification={notification} />;
  };

  const handleLoadMore = () => {
    dispatch(fetchNotifications(page + 1));
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
