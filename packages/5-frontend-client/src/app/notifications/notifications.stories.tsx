import { Meta, Story } from '@storybook/react';
import { createDate, createNotification, createUser, setNotifications } from 'frontend-domain';
import { NotificationType } from 'shared';

import { maxWidthDecorator, reduxDecorator, routerDecorator, SetupRedux } from '~/utils/storybook';

import { Notifications } from './notifications';

// cspell:words poang raspout

export default {
  title: 'Domain/Notifications',
  decorators: [reduxDecorator(), routerDecorator(), maxWidthDecorator()],
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

export const notifications: Story<{ setup: SetupRedux }> = () => <Notifications />;

notifications.args = {
  setup: (dispatch) => {
    dispatch(setNotifications({ page: 1 }, [notification1, notification2]));
  },
};
