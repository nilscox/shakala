import { EntitySelectors } from '@nilscox/redux-kooltik';
import { createSelector } from 'reselect';

import { normalizationSelectors, threadSchema } from '../../normalization';
import { AppState } from '../../store';

import { ThreadMeta } from './thread.actions';
import { NormalizedThread, Thread } from './thread.types';

class ThreadSelectors extends EntitySelectors<AppState, NormalizedThread, ThreadMeta> {
  constructor() {
    super('thread', (state) => state.thread);
  }

  isFetching = this.propertySelector('fetching');

  byId = normalizationSelectors.createEntitySelector<Thread>('thread', threadSchema);
  byIds = normalizationSelectors.createEntitiesSelector<Thread>(threadSchema);

  private lastThreadIds = this.propertySelector('lastThreads');

  lastThreads = createSelector([(state: AppState) => state, this.lastThreadIds], this.byIds);
  nLastThreads = createSelector([this.lastThreads, (state, count: number) => count], (threads, count) =>
    threads.slice(0, count),
  );
}

export const threadSelectors = new ThreadSelectors();
