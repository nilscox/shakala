import {
  DateFormat,
  formatDate,
  formatDateRelativeOrAbsolute,
  Notification as TNotification,
  notificationActions,
} from '@shakala/frontend-domain';
import { NotificationType } from '@shakala/shared';

import { IconButton } from '~/elements/icon-button';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import Check from '~/icons/check.svg';

type NotificationItemProps<Type extends NotificationType> = {
  notification: TNotification<Type>;
};

export type NotificationItem<Type extends NotificationType> = React.ComponentType<
  NotificationItemProps<Type>
>;

type NotificationProps = {
  notification: TNotification;
  title: React.ReactNode;
  children: React.ReactNode;
};

export const Notification = ({ notification, title, children }: NotificationProps) => (
  <div className="rounded bg-neutral p-4 drop-shadow-sm">
    <div className="row justify-between">
      <div>
        <time
          dateTime={notification.date}
          title={formatDate(notification.date, DateFormat.full)}
          className="ml-auto text-xs font-medium text-muted"
        >
          {formatDateRelativeOrAbsolute(notification.date)}
        </time>
        <strong className="my-1 block text-lg">{title}</strong>
      </div>
      <div>
        <MarkAsSeenButton notification={notification} />
      </div>
    </div>
    {children}
  </div>
);

type MarkAsSeenButtonProps = {
  notification: TNotification;
};

const MarkAsSeenButton = ({ notification }: MarkAsSeenButtonProps) => {
  const dispatch = useAppDispatch();

  if (notification.seen) {
    return null;
  }

  return (
    <IconButton
      title="Marquer comme vue"
      icon={<Check />}
      onClick={() => dispatch(notificationActions.markNotificationAsSeen(notification.id))}
    />
  );
};
