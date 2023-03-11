import {
  BaseError,
  commandCreator,
  CommandHandler,
  DatePort,
  DomainEvent,
  EventPublisher,
  registerCommand,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { NotificationRepository } from '../../repositories/notification.repository';
import { NOTIFICATION_TOKENS } from '../../tokens';

export type MarkNotificationAsSeenCommand = {
  notificationId: string;
};

export const markNotificationAsSeen = commandCreator<MarkNotificationAsSeenCommand>('markNotificationAsSeen');

export class MarkNotificationAsSeenHandler implements CommandHandler<MarkNotificationAsSeenCommand> {
  constructor(
    private readonly dateAdapter: DatePort,
    private readonly publisher: EventPublisher,
    private readonly notificationRepository: NotificationRepository
  ) {}

  async handle(command: MarkNotificationAsSeenCommand): Promise<void> {
    const { notificationId } = command;

    const notification = await this.notificationRepository.findByIdOrFail(notificationId);

    if (notification.seenDate !== undefined) {
      throw new NotificationAlreadySeen(notificationId);
    }

    notification.setSeenDate(this.dateAdapter.now());

    await this.notificationRepository.save(notification);

    this.publisher.publish(new NotificationMarkedAsSeenEvent(notificationId));
  }
}

injected(
  MarkNotificationAsSeenHandler,
  TOKENS.date,
  TOKENS.publisher,
  NOTIFICATION_TOKENS.repositories.notificationRepository
);

registerCommand(markNotificationAsSeen, NOTIFICATION_TOKENS.commands.markNotificationAsSeenHandler);

export class NotificationAlreadySeen extends BaseError<{ notificationId: string }> {
  status = 400;

  constructor(notificationId: string) {
    super('notification already seen', { notificationId });
  }
}

export class NotificationMarkedAsSeenEvent extends DomainEvent {
  constructor(notificationId: string) {
    super('Notification', notificationId);
  }
}
