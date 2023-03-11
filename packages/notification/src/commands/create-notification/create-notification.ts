import {
  commandCreator,
  CommandHandler,
  DatePort,
  GeneratorPort,
  registerCommand,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { Notification, NotificationPayloadMap, NotificationType } from '../../entities/notification.entity';
import { NotificationRepository } from '../../repositories/notification.repository';
import { NOTIFICATION_TOKENS } from '../../tokens';

export type CreateNotificationCommand<Type extends NotificationType> = {
  userId: string;
  type: Type;
  payload: NotificationPayloadMap[Type];
};

export const createNotification =
  commandCreator<CreateNotificationCommand<NotificationType>>('createNotification');

export class CreateNotificationHandler
  implements CommandHandler<CreateNotificationCommand<NotificationType>>
{
  constructor(
    private readonly generator: GeneratorPort,
    private readonly dateAdapter: DatePort,
    private readonly notificationRepository: NotificationRepository
  ) {}

  async handle<Type extends NotificationType>(command: CreateNotificationCommand<Type>): Promise<void> {
    const { userId, type, payload } = command;

    await this.notificationRepository.save(
      new Notification({
        id: await this.generator.generateId(),
        date: this.dateAdapter.now(),
        userId,
        type,
        payload,
      })
    );
  }
}

injected(
  CreateNotificationHandler,
  TOKENS.generator,
  TOKENS.date,
  NOTIFICATION_TOKENS.repositories.notificationRepository
);

registerCommand(createNotification, NOTIFICATION_TOKENS.commands.createNotificationHandler);
