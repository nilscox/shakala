import { Meta, StoryFn } from '@storybook/react';
import { createDate, createNotification, createUser, notificationActions } from '@shakala/frontend-domain';
import { NotificationType } from '@shakala/shared';

import { maxWidthDecorator, reduxDecorator, SetupRedux } from '~/utils/storybook';

import { Notifications } from './notifications';

// cspell:words poang raspout

export default {
  title: 'Domain/Notifications',
  decorators: [reduxDecorator(), maxWidthDecorator()],
} as Meta;

const notification1 = createNotification({
  type: NotificationType.threadCreated,
  date: createDate('2022-10-22'),
  seen: false,
  payload: {
    threadId: 'threadId',
    author: createUser({ nick: 'nilscox' }),
    text: 'Qui passe le plus de temps sur le poang ?',
  },
});

const notification2 = createNotification({
  type: NotificationType.rulesUpdated,
  date: createDate('2022-10-19'),
  seen: createDate('2022-10-20'),
  payload: {
    version: '5.1',
    changes: [
      "- Il n'est plus permis de se lécher les babines",
      '- Il faut maintenant attendre devant la porte 30 minutes sans faire de bruit avant de pouvoir sortir',
      "- Et mano tu arrêtes d'embêter raspout s'il te plait",
    ].join('\n'),
  },
});

export const notifications: StoryFn<{ setup: SetupRedux }> = () => <Notifications />;

notifications.args = {
  setup(dispatch) {
    dispatch(notificationActions.setNotifications([notification1, notification2]));
    // todo: remove
    dispatch(notificationActions.setList([notification1.id, notification2.id]));
  },
};
