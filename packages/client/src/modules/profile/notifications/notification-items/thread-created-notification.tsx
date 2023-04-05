import { NotificationDto, NotificationType } from '@shakala/shared';

import { Link } from '~/elements/link';

import { Notification } from '../notification';

type ThreadCreatedNotificationProps = {
  notification: NotificationDto<NotificationType.threadCreated>;
};

export const ThreadCreatedNotification = ({ notification }: ThreadCreatedNotificationProps) => (
  <Notification notification={notification} title="Nouveau fil de discussion">
    <p>
      <strong>{notification.payload.author.nick}</strong> a créé un nouveau fil de discussion :{' '}
      <Link href={`/discussions/${notification.payload.threadId}`}>{notification.payload.description}</Link>
    </p>
  </Notification>
);
