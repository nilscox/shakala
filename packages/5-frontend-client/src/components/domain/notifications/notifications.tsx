import { fetchNotifications, Notification, selectNotifications } from 'frontend-domain';
import { useEffect } from 'react';
import { NotificationType } from 'shared';

import { useDispatch } from '../../../hooks/use-dispatch';
import { useSelector } from '../../../hooks/use-selector';

import { NotificationItem } from './notification';
import { notificationComponentMap } from './notification-items';

export const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  useEffect(() => {
    dispatch(fetchNotifications(1));
  }, [dispatch]);

  const renderNotification = <Type extends NotificationType>(
    notification: Notification<Type>,
    index: number,
  ) => {
    const Component = notificationComponentMap[notification.type] as NotificationItem<Type>;

    return <Component key={index} notification={notification} />;
  };

  return <div className="col gap-4">{notifications.map(renderNotification)}</div>;
};
