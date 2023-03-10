import { commandCreator, CommandHandler, DatePort, registerCommand, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { Notification, NotificationPayloadMap, NotificationType } from '../entities/notification.entity';
import { NotificationRepository } from '../repositories/notification.repository';
import { NOTIFICATION_TOKENS } from '../tokens';

export type CreateNotificationCommand<Type extends NotificationType> = {
  notificationId: string;
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
    private readonly dateAdapter: DatePort,
    private readonly notificationRepository: NotificationRepository
  ) {}

  async handle<Type extends NotificationType>(command: CreateNotificationCommand<Type>): Promise<void> {
    const { userId, type, payload } = command;

    await this.notificationRepository.save(
      new Notification({
        id: command.notificationId,
        date: this.dateAdapter.now(),
        userId,
        type,
        payload,
      })
    );
  }
}

injected(CreateNotificationHandler, TOKENS.date, NOTIFICATION_TOKENS.repositories.notificationRepository);
registerCommand(createNotification, NOTIFICATION_TOKENS.commands.createNotificationHandler);
