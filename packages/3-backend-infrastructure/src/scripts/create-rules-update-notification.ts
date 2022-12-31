import { CreateNotificationCommand, ExecutionContext } from '@shakala/backend-application';
import { NotificationPayloadMap, NotificationType } from '@shakala/shared';

import { Application } from '../application';

const type = NotificationType.rulesUpdated;
const payload: NotificationPayloadMap[typeof type] = {
  version: '',
  changes: '',
};

const seed = async (argv: string[]) => {
  const app = new Application();

  try {
    await app.init();

    await app.run(async ({ commandBus }) => {
      for (const userId of argv) {
        await commandBus.execute(
          new CreateNotificationCommand(userId, type, payload),
          ExecutionContext.unauthenticated,
        );
      }
    });
  } finally {
    await app.close();
  }
};

seed(process.argv.slice(2)).catch(console.error);
