import { EntityFactory, randomId, Timestamp } from '@shakala/common';
import { NotificationType } from '@shakala/shared';

import { Notification } from './entities/notification.entity';

type Factories = {
  notification: EntityFactory<Notification>;
};

export const create: Factories = {
  notification(props) {
    return new Notification({
      id: randomId(),
      type: NotificationType.rulesUpdated,
      date: new Timestamp(0),
      userId: '',
      payload: {
        changes: '',
        version: '',
      },
      ...props,
    });
  },
};
