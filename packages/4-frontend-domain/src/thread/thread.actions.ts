import { createNormalizedActions } from '@nilscox/redux-query';

import { Comment, Thread } from '../types';

export const {
  setEntity: addThread,
  setEntities: addThreads,
  updateEntity: updateThread,
} = createNormalizedActions<Thread>('thread');

export const setThreadComments = (threadId: string, comments: Comment[]) => {
  return updateThread(threadId, { comments });
};
