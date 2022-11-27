import { EntityAdapter, EntitySelectors } from '@nilscox/redux-kooltik';
import { createSelector } from 'reselect';

import { AppState } from '../../store';

import { NotificationMeta } from './notification.actions';
import { Notification } from './notification.types';

class NotificationSelectors extends EntitySelectors<AppState, Notification, NotificationMeta> {
  private adapter = new EntityAdapter<Notification>((notification) => notification.id);

  constructor() {
    super('notification', (state) => state.notification);
  }

  byId = createSelector(
    [this.selectState, (entities, notificationId: string) => notificationId],
    (entities, id) => this.adapter.selectOne(entities, id),
  );

  byIds = createSelector(
    [this.selectState, (entities, notificationIds: string[]) => notificationIds],
    (entities, ids) => this.adapter.selectMany(entities, ids),
  );

  private selectIds = this.idsSelector();
  list = createSelector([(state: AppState) => state, this.selectIds], this.byIds);

  isFetching = this.propertySelector('fetching');
  total = this.propertySelector('total');
  totalUnseen = this.propertySelector('totalUnseen');

  hasMore = createSelector([this.selectIds, this.total], (ids, total) => {
    if (total === null) {
      return false;
    }

    return ids.length < total;
  });
}

export const notificationSelectors = new NotificationSelectors();
