'use client';

import { Notification, selectNotifications } from 'frontend-domain';
import { NotificationType } from 'shared';

import { useSelector } from '../../../hooks/use-selector';

import { NotificationItem } from './notification';
import { notificationComponentMap } from './notification-items';

export const Notifications = () => {
  const notifications = useSelector(selectNotifications);

  const renderNotification = <Type extends NotificationType>(
    notification: Notification<Type>,
    index: number,
  ) => {
    const Component = notificationComponentMap[notification.type] as NotificationItem<Type>;

    return <Component key={index} notification={notification} />;
  };

  return <div className="col gap-4">{notifications.map(renderNotification)}</div>;
};
