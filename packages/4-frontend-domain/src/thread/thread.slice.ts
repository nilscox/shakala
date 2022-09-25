import { createNormalizedUpdater, Normalized, normalized } from '@nilscox/redux-query';
import { AnyAction, combineReducers } from 'redux';

import { schemas } from '../normalization';
import { Thread } from '../types';

import { createdRootCommentsReducer } from './lists/created-root-comments';
import { lastThreadsReducer } from './lists/last-threads';
import {
  createRootCommentQueryReducer,
  getThreadQueryReducer,
  isAddRootCommentToThreadAction,
} from './use-cases';
import { createThreadQueryReducer } from './use-cases/create-thread/create-thread';

type NormalizedThread = Normalized<Thread, 'author' | 'comments'>;

const threadUpdater = createNormalizedUpdater('thread');

const normalizedThreadsReducer = (
  threads: Record<string, NormalizedThread>,
  action: AnyAction,
): Record<string, NormalizedThread> => {
  const updateThread = threadUpdater(threads);

  if (isAddRootCommentToThreadAction(action)) {
    const { threadId, commentId } = action;

    return updateThread(threadId, (thread) => {
      return {
        comments: [...thread.comments, commentId],
      };
    });
  }

  return threads;
};

export const threadsReducer = combineReducers({
  entities: normalized<NormalizedThread>(schemas, 'thread', normalizedThreadsReducer),
  lastThreads: lastThreadsReducer,
  createdRootComments: createdRootCommentsReducer,
  queries: combineReducers({
    getThread: getThreadQueryReducer,
  }),
  mutations: combineReducers({
    createThread: createThreadQueryReducer,
    createRootComment: createRootCommentQueryReducer,
  }),
});
