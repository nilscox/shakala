import { NotificationType } from 'shared';

import { Link } from '../../../elements/link';
import { Notification, NotificationItem } from '../notification';

export const ThreadCreatedNotification: NotificationItem<NotificationType.threadCreated> = ({
  notification,
}) => {
  return (
    <Notification notification={notification} title="Nouveau fil de discussion">
      <p>
        <strong>{notification.payload.author.nick}</strong> a créé un nouveau fil de discussion :{' '}
        <Link href={`/discussion/${notification.payload.threadId}`}>{notification.payload.text}</Link>
      </p>
    </Notification>
  );
};
