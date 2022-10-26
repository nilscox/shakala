import { DatePort, Timestamp } from 'backend-domain';

import { Command, CommandHandler } from '../../../cqs';
import { NotificationRepository } from '../../../interfaces';

export class MarkNotificationAsSeenCommand implements Command {
  constructor(readonly notificationId: string) {}
}

export class MarkNotificationAsSeenHandler implements CommandHandler<MarkNotificationAsSeenCommand> {
  constructor(
    private dateAdapter: DatePort,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async handle(command: MarkNotificationAsSeenCommand): Promise<void> {
    const { notificationId } = command;

    const notification = await this.notificationRepository.findByIdOrFail(notificationId);

    // todo: move logic to the notification entity
    notification.setSeenDate(new Timestamp(this.dateAdapter.now()));

    await this.notificationRepository.save(notification);
  }
}
