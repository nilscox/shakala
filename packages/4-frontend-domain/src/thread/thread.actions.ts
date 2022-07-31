import { createNormalizedActions } from '@nilscox/redux-query';
import { getIds } from 'shared';

import { Comment } from '../types';

export const {
  setEntity: addThread,
  setEntities: addThreads,
  updateEntity: updateThread,
} = createNormalizedActions('thread');

export const setThreadComments = (threadId: string, comments: Comment[]) => {
  return updateThread(threadId, { comments: getIds(comments) });
};
