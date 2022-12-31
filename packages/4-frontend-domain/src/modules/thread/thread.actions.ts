import { EntityActions, EntityAdapter } from '@nilscox/redux-kooltik';
import { getIds } from '@shakala/shared';

import { normalizeThread, normalizeThreads, normalizeComments } from '../../normalization';

import {
  clearDraftRootComment,
  createRootComment,
  getInitialDraftRootComment,
  saveDraftRootComment,
} from './create-root-comment/create-root-comment';
import { createThread } from './create-thread/create-thread';
import { fetchLastThreads } from './fetch-last-threads/fetch-last-threads';
import { fetchThread } from './fetch-thread/fetch-thread';
import { setThreadSearchFilter, setThreadSortFilter } from './set-thread-filters/set-thread-filters';
import { NormalizedThread } from './thread.types';

export type ThreadMeta = {
  fetching: boolean;
  lastThreads: string[];
};

class ThreadActions extends EntityActions<NormalizedThread, ThreadMeta> {
  private adapter = new EntityAdapter<NormalizedThread>((thread) => thread.id);

  constructor() {
    super('thread', {
      fetching: false,
      lastThreads: [],
    });
  }

  setNormalizedThreads = this.action('set-normalized-threads', this.adapter.setMany);

  setFetching = this.createSetter('fetching');
  setLastThreads = this.createSetter('lastThreads', 'last-threads');

  addLastThread = this.action('add-last-thread', normalizeThread, (state: ThreadMeta, thread) => {
    state.lastThreads.unshift(thread.id);
  });

  setThread = this.action('set-thread', normalizeThread, this.adapter.setOne);
  setThreads = this.action('set-threads', normalizeThreads, this.adapter.setMany);

  setComments = this.entityAction('set-comments', normalizeComments, (thread, comments) => {
    thread.comments = getIds(comments);
  });

  addComments = this.entityAction('add-comments', normalizeComments, (thread, comments) => {
    thread.comments.push(...getIds(comments));
  });

  fetchLastThreads = fetchLastThreads;
  fetchThread = fetchThread;
  setThreadSearchFilter = setThreadSearchFilter;
  setThreadSortFilter = setThreadSortFilter;

  createThread = createThread;

  createRootComment = createRootComment;
  getInitialDraftRootComment = getInitialDraftRootComment;
  saveDraftRootComment = saveDraftRootComment;
  clearDraftRootComment = clearDraftRootComment;
}

export const threadActions = new ThreadActions();
