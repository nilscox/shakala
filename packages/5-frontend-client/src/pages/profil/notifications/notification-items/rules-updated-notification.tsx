import { NotificationType } from 'shared';

import { Link } from '~/components/elements/link';
import { Markdown } from '~/components/elements/markdown';

import { Notification, NotificationItem } from '../notification';

export const RulesUpdatedNotification: NotificationItem<NotificationType.rulesUpdated> = ({
  notification,
}) => {
  return (
    <Notification notification={notification} title="Mise à jour de la charte">
      <p>
        Quelque modifications ont été apporté à <strong>la charte</strong>, veillez en prendre connaissance et
        adapter votre utilisation de Shakala en conséquence.
      </p>

      <Markdown className="my-2" markdown={notification.payload.changes} />

      <p>
        Retrouvez la version complète de la charte mise à jour{' '}
        <Link href={`/charte?${new URLSearchParams({ version: notification.payload.version })}`}>
          sur cette page
        </Link>
        .
      </p>
    </Notification>
  );
};
