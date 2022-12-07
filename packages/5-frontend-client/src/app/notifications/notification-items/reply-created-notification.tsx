import { Fragment } from 'react';
import { NotificationType } from 'shared';

import { ThreadLink } from '~/elements/link';

import { Markdown } from '../../../elements/markdown';
import { useUser } from '../../../hooks/use-user';
import { Notification, NotificationItem } from '../notification';

export const ReplyCreatedNotification: NotificationItem<NotificationType.replyCreated> = ({
  notification,
}) => {
  const user = useUser();

  const { threadId, threadDescription } = notification.payload;
  const { parentAuthor, replyId, replyAuthor } = notification.payload;
  const { text } = notification.payload;

  const getMessage = () => {
    const message: React.ReactNode[] = [];

    message.push(<strong key={1}>{replyAuthor.nick}</strong>);
    message.push(' ');

    if (user?.id === parentAuthor.id) {
      message.push(<Fragment key={2}>vous a répondu</Fragment>);
    } else if (parentAuthor.id === replyAuthor.id) {
      message.push(<Fragment key={2}>a répondu à son message</Fragment>);
    } else {
      message.push(
        <Fragment key={3}>
          a répondu au message de <strong>{parentAuthor.nick}</strong>
        </Fragment>,
      );
    }

    message.push(' ');
    message.push(
      <Fragment key={4}>
        sur le fil de discussion <ThreadLink threadId={threadId}>{threadDescription}</ThreadLink>
      </Fragment>,
    );

    return message;
  };

  return (
    <Notification
      notification={notification}
      title={'Nouvelle réponse' + (user?.id !== parentAuthor.id ? ' à un message suivi' : '')}
    >
      <div>
        <div>{getMessage()}</div>
        <div className="relative pl-2 border-l-4 my-4">
          <Markdown markdown={text} className="line-clamp-3" />
          <ThreadLink className="absolute inset-0" threadId={threadId} commentId={replyId} />
        </div>
      </div>
    </Notification>
  );
};
