import { NotificationType } from 'shared';

import { ThreadLink } from '~/elements/link';

import { Markdown } from '../../../elements/markdown';
import { When } from '../../../elements/when';
import { useUser } from '../../../hooks/use-user';
import { Notification, NotificationItem } from '../notification';

export const ReplyCreatedNotification: NotificationItem<NotificationType.replyCreated> = ({
  notification,
}) => {
  const user = useUser();

  const { threadId, threadDescription } = notification.payload;
  const { parentAuthor, replyId, replyAuthor } = notification.payload;
  const { text } = notification.payload;

  return (
    <Notification
      notification={notification}
      title={'Nouvelle réponse' + user?.id !== parentAuthor.id ? ' à un message suivi' : ''}
    >
      <div>
        <strong>{replyAuthor.nick}</strong>{' '}
        <When
          condition={user?.id === parentAuthor.id}
          then={<>vous à répondu</>}
          // prettier-ignore
          else={<>à répondu au message de <strong>{parentAuthor.nick}</strong></>}
        />{' '}
        sur le fil de discussion <ThreadLink threadId={threadId}>{threadDescription}</ThreadLink>
        <div className="relative pl-2 border-l-4 my-4">
          <Markdown markdown={text} className="line-clamp-3" />
          <ThreadLink className="absolute inset-0" threadId={threadId} commentId={replyId} />
        </div>
      </div>
    </Notification>
  );
};
