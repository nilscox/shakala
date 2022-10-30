import { createAction, createNormalizedActions } from '@nilscox/redux-query';

import { Notification } from '../types';

export const { setEntities: setNotifications } = createNormalizedActions('notification');

export const [addNotifications, isAddNotifications] = createAction(
  'add-notifications',
  (notifications: Notification[]) => ({ notifications }),
);

export const [setTotalNotifications, isSetTotalNotifications] = createAction(
  'set-total-notifications',
  (total: number) => ({ total }),
);

export const [setLoadingNotification, isSetLoadingNotifications] = createAction(
  'set-loading-notifications',
  (loading: boolean) => ({ loading }),
);
