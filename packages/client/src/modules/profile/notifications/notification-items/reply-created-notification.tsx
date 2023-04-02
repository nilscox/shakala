import { defined, NotificationDto, NotificationType } from '@shakala/shared';
import { Fragment } from 'react';

import { Link } from '~/elements/link';
import { useUser } from '~/hooks/use-user';
import { withSuspense } from '~/utils/with-suspense';

import { Notification } from '../notification';

type ReplyCreatedNotificationProps = {
  notification: NotificationDto<NotificationType.replyCreated>;
};

// todo: remove withSuspense / add prefetched queries to stories
export const ReplyCreatedNotification = withSuspense(({ notification }: ReplyCreatedNotificationProps) => {
  const user = defined(useUser());

  const { threadId, threadDescription } = notification.payload;
  const { parentAuthor, replyId, replyAuthor } = notification.payload;
  const { text } = notification.payload;

  const getMessage = () => {
    const message: React.ReactNode[] = [];

    message.push(<strong key={1}>{replyAuthor.nick}</strong>);
    message.push(' ');

    if (user.id === parentAuthor.id) {
      message.push(<Fragment key={2}>vous a répondu</Fragment>);
    } else if (parentAuthor.id === replyAuthor.id) {
      message.push(<Fragment key={2}>a répondu à son message</Fragment>);
    } else {
      message.push(
        <Fragment key={3}>
          a répondu au message de <strong>{parentAuthor.nick}</strong>
        </Fragment>
      );
    }

    message.push(' ');
    message.push(
      <Fragment key={4}>
        sur le fil de discussion <Link href={`/discussions/${threadId}`}>{threadDescription}</Link>
      </Fragment>
    );

    return message;
  };

  return (
    <Notification
      notification={notification}
      title={'Nouvelle réponse' + (user.id !== parentAuthor.id ? ' à un message suivi' : '')}
    >
      <div>
        <div>{getMessage()}</div>
        <div className="relative my-4 border-l-4 pl-2">
          {/* <Markdown markdown={text} className="line-clamp-3" /> */}
          <div className="line-clamp-3">{text}</div>
          <Link href={`/discussions/${threadId}#${replyId}`} className="absolute inset-0" />
        </div>
      </div>
    </Notification>
  );
});
