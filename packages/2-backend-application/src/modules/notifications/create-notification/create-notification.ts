import { DatePort, GeneratorPort, Notification, Timestamp } from '@shakala/backend-domain';
import { NotificationPayloadMap, NotificationType } from '@shakala/shared';

import { Command, CommandHandler } from '../../../cqs';
import { NotificationRepository } from '../../../interfaces';

export class CreateNotificationCommand<Type extends NotificationType> implements Command {
  constructor(readonly userId: string, readonly type: Type, readonly payload: NotificationPayloadMap[Type]) {}
}

export class CreateNotificationHandler
  implements CommandHandler<CreateNotificationCommand<NotificationType>>
{
  constructor(
    private generator: GeneratorPort,
    private dateAdapter: DatePort,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async handle(command: CreateNotificationCommand<NotificationType>): Promise<void> {
    const { userId, type, payload } = command;

    await this.notificationRepository.save(
      new Notification({
        id: await this.generator.generateId(),
        date: new Timestamp(this.dateAdapter.now()),
        userId,
        type,
        payload,
      }),
    );
  }
}
