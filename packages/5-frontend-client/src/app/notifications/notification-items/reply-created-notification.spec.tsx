import { screen } from '@testing-library/react';
import {
  createAuthUser,
  createDate,
  createNotification,
  createTestStore,
  createUser,
  TestStore,
} from 'frontend-domain';
import { createFactory, NotificationPayloadMap, NotificationType, randomId } from 'shared';

import { createTestRenderer, TestRenderer } from '../../../utils/test-renderer';

import { ReplyCreatedNotification } from './reply-created-notification';

describe('ReplyCreatedNotification', () => {
  let render: TestRenderer;
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
    store.user = createAuthUser();

    render = createTestRenderer().withStore(store);
  });

  const mano = createUser({ nick: 'mano' });
  const rasp = createUser({ nick: 'rasp' });

  const createPayload = createFactory<NotificationPayloadMap[NotificationType.replyCreated]>(() => ({
    threadId: randomId(),
    threadDescription: '',
    parentId: randomId(),
    parentAuthor: createUser(),
    replyId: randomId(),
    replyAuthor: createUser(),
    text: '',
  }));

  const findText = (text: string) => {
    return screen.getByText((_, element) => {
      // console.log(element?.textContent);
      return element?.textContent === text;
    });
  };

  it('renders the notification received when a subscribed comment gets a reply', () => {
    const notification = createNotification({
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

    expect(findText('Le 1 janvier 2022')).toBeVisible();
    expect(findText('Nouvelle réponse à un message suivi')).toBeVisible();
    expect(findText('rasp a répondu au message de mano sur le fil de discussion thread')).toBeVisible();
    expect(screen.getByText('hello')).toBeVisible();
  });

  it('shows a different message to the parent comment author', () => {
    const notification = createNotification({
      type: NotificationType.replyCreated,
      date: createDate('2022-01-01'),
      payload: createPayload({
        threadDescription: 'thread',
        parentAuthor: mano,
        replyAuthor: rasp,
        text: 'hello',
      }),
    });

    store.user = createAuthUser(mano);

    render(<ReplyCreatedNotification notification={notification} />);

    expect(findText('Nouvelle réponse')).toBeVisible();
    expect(findText('rasp vous a répondu sur le fil de discussion thread')).toBeVisible();
  });

  it('shows a different message when the user replies to himself', () => {
    const notification = createNotification({
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

    expect(findText('mano a répondu à son message sur le fil de discussion thread')).toBeVisible();
  });
});
