import { NotificationDto, NotificationType } from '@shakala/shared';

import { Link } from '~/elements/link';
import { Markdown } from '~/elements/markdown';

import { Notification } from '../notification';

type RulesUpdatedNotificationProps = {
  notification: NotificationDto<NotificationType.rulesUpdated>;
};

export const RulesUpdatedNotification = ({ notification }: RulesUpdatedNotificationProps) => (
  <Notification notification={notification} title="Mise à jour de la charte">
    <p>
      Quelque modifications ont été apporté à <strong>la charte</strong>, veillez en prendre connaissance et
      adapter votre utilisation de Shakala en conséquence.
    </p>

    <Markdown className="my-2" markdown={notification.payload.changes} />
    <div className="my-2">{notification.payload.changes}</div>

    <p>
      Retrouvez la version complète de la charte mise à jour{' '}
      <Link href={`/charte?${new URLSearchParams({ version: notification.payload.version })}`}>
        sur cette page
      </Link>
      .
    </p>
  </Notification>
);
