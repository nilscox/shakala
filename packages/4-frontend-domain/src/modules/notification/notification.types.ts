import { NotificationDto, NotificationPayloadMap, NotificationType, randomId } from 'shared';

export type Notification<Type extends NotificationType = NotificationType> = NotificationDto<Type>;

export const createNotification = <Type extends NotificationType>(
  overrides: Partial<Notification<Type>> = {},
): Notification<Type> => ({
  id: randomId(),
  type: '' as Type,
  payload: {} as NotificationPayloadMap[Type],
  date: '',
  seen: false,
  ...overrides,
});
