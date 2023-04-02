import { NotificationDto } from '@shakala/shared';

import { IconButton } from '~/elements/icon-button';
import { useMutate } from '~/hooks/use-mutate';
import Check from '~/icons/check.svg';
import { DateFormat, formatDate, formatDateRelativeOrAbsolute } from '~/utils/date-utils';
import { getQueryKey } from '~/utils/query-key';

type NotificationProps = {
  notification: NotificationDto;
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
  notification: NotificationDto;
};

const MarkAsSeenButton = ({ notification }: MarkAsSeenButtonProps) => {
  const markAsSeen = useMutate(TOKENS.account, 'markNotificationAsSeen', {
    invalidate: [
      getQueryKey(TOKENS.account, 'getNotificationsCount'),
      getQueryKey(TOKENS.account, 'getNotifications'),
    ],
  });

  if (notification.seen) {
    return null;
  }

  return (
    <IconButton title="Marquer comme vue" icon={<Check />} onClick={() => markAsSeen(notification.id)} />
  );
};
