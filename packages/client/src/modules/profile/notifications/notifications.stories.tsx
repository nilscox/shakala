import { createAuthorDto, createNotificationDto, createUserDto, NotificationType } from '@shakala/shared';
import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { createDate } from '~/utils/date-utils';
import { configureStory, maxWidthDecorator } from '~/utils/storybook';

import { Notifications } from './notifications';

// cspell:words poang raspout

export default {
  title: 'Domain/Notifications',
  decorators: [maxWidthDecorator],
} as Meta;

const notification1 = createNotificationDto({
  type: NotificationType.threadCreated,
  date: createDate('2022-10-22'),
  seen: false,
  payload: {
    threadId: 'threadId',
    author: createAuthorDto({ nick: 'nilscox' }),
    description: 'Qui passe le plus de temps sur le poang ?',
  },
});

const notification2 = createNotificationDto({
  type: NotificationType.rulesUpdated,
  date: createDate('2022-10-19'),
  seen: createDate('2022-10-20'),
  payload: {
    version: '49.3',
    changes: `<ul>
      <li>Il n'est plus permis de se lécher les babines</li>
      <li>Il faut maintenant attendre devant la porte 30 minutes sans faire de bruit avant de pouvoir sortir</li>
      <li>Et mano tu arrêtes d'embêter raspout s'il te plait</li>
    </ul>`,
  },
});

const notification3 = createNotificationDto({
  type: NotificationType.replyCreated,
  date: createDate('2022-10-15'),
  payload: {
    threadId: 'threadId',
    threadDescription: 'Qui passe le plus de temps sur le poang ?',
    parentId: 'parentId',
    parentAuthor: createAuthorDto({ id: 'userId' }),
    replyId: 'replyId',
    replyAuthor: createAuthorDto({ nick: 'Nils' }),
    text: "Bah c'est moi, non ?",
  },
});

export const notifications: StoryFn = () => (
  <Notifications
    notifications={[notification1, notification2, notification3]}
    hasMore={false}
    loadMore={action('loadMore')}
  />
);

notifications.decorators = [
  configureStory((adapters) => {
    adapters.authentication.getAuthenticatedUser.resolve(createUserDto({ id: 'userId' }));
  }),
];
