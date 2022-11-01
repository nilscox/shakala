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

import { useAppSelector } from '~/hooks/use-app-selector';

import { InfiniteScroll } from '../../../elements/infinite-scroll/infinite-scroll';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';

import { NotificationItem } from './notification';
import { notificationComponentMap } from './notification-items';

export const Notifications = () => {
  const dispatch = useAppDispatch();

  const notifications = useAppSelector(selectNotifications);
  const hasMoreNotifications = useAppSelector(selectHasMoreNotifications);
  const isLoadingNotifications = useAppSelector(selectIsLoadingNotifications);

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
