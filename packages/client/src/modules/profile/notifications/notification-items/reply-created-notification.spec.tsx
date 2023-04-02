import expect from '@nilscox/expect';
import {
  createAuthorDto,
  createFactory,
  createNotificationDto,
  createUserDto,
  NotificationPayloadMap,
  NotificationType,
  randomId,
} from '@shakala/shared';
import { screen } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';

import { createDate } from '~/utils/date-utils';
import { setupTest } from '~/utils/setup-test';

import { ReplyCreatedNotification } from './reply-created-notification';

describe('ReplyCreatedNotification', () => {
  const { render, setUser } = setupTest();

  const mano = createAuthorDto({ nick: 'mano' });
  const rasp = createAuthorDto({ nick: 'rasp' });

  const createPayload = createFactory<NotificationPayloadMap[NotificationType.replyCreated]>(() => ({
    threadId: randomId(),
    threadDescription: '',
    parentId: randomId(),
    parentAuthor: createAuthorDto(),
    replyId: randomId(),
    replyAuthor: createAuthorDto(),
    text: '',
  }));

  const findText = (text: string) => {
    expect(
      screen.getByText((_, element) => {
        // console.log(element?.textContent);
        return element?.textContent === text;
      })
    ).toBeVisible();
  };

  beforeEach(() => {
    setUser(createUserDto());
  });

  it('renders the notification received when a subscribed comment gets a reply', () => {
    const notification = createNotificationDto({
      type: NotificationType.replyCreated,
      date: createDate('2022-01-01'),
      payload: createPayload({
        threadDescription: 'thread',
        parentAuthor: mano,
        replyAuthor: rasp,
        text: 'hello',
      }),
    });

    render(<ReplyCreatedNotification notification={notification} />);

    findText('Le 1 janvier 2022');
    findText('Nouvelle réponse à un message suivi');
    findText('rasp a répondu au message de mano sur le fil de discussion thread');
    expect(screen.getByText('hello')).toBeVisible();
  });

  it('shows a different message to the parent comment author', () => {
    const notification = createNotificationDto({
      type: NotificationType.replyCreated,
      date: createDate('2022-01-01'),
      payload: createPayload({
        threadDescription: 'thread',
        parentAuthor: mano,
        replyAuthor: rasp,
        text: 'hello',
      }),
    });

    setUser(createUserDto(mano));

    render(<ReplyCreatedNotification notification={notification} />);

    findText('Nouvelle réponse');
    findText('rasp vous a répondu sur le fil de discussion thread');
  });

  it('shows a different message when the user replies to himself', () => {
    const notification = createNotificationDto({
      type: NotificationType.replyCreated,
      date: createDate('2022-01-01'),
      payload: createPayload({
        threadDescription: 'thread',
        parentAuthor: mano,
        replyAuthor: mano,
        text: 'hello',
      }),
    });

    render(<ReplyCreatedNotification notification={notification} />);

    findText('mano a répondu à son message sur le fil de discussion thread');
  });
});
