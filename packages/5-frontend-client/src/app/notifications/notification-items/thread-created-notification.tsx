import { NotificationType } from 'shared';

import { ThreadLink } from '~/elements/link';

import { Notification, NotificationItem } from '../notification';

export const ThreadCreatedNotification: NotificationItem<NotificationType.threadCreated> = ({
  notification,
}) => {
  return (
    <Notification notification={notification} title="Nouveau fil de discussion">
      <p>
        <strong>{notification.payload.author.nick}</strong> a créé un nouveau fil de discussion :{' '}
        <ThreadLink threadId={notification.payload.threadId}>{notification.payload.text}</ThreadLink>
      </p>
    </Notification>
  );
};
