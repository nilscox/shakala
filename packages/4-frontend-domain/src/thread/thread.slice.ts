import { createNormalizedUpdater, Normalized, normalized } from '@nilscox/redux-query';
import { AnyAction, combineReducers } from '@reduxjs/toolkit';

import { schemas } from '../normalization';
import { Thread } from '../types';

import { createdRootCommentsReducer } from './lists/created-root-comments';
import { lastThreadsReducer } from './lists/last-threads';
import {
  AddRootCommentToThreadAction,
  createRootCommentQueryReducer,
  getThreadQueryReducer,
} from './use-cases';

type NormalizedThread = Normalized<Thread, 'author' | 'comments'>;

const threadUpdater = createNormalizedUpdater('thread');

const normalizedThreadsReducer = (
  threads: Record<string, NormalizedThread>,
  action: AnyAction,
): Record<string, NormalizedThread> => {
  const updateThread = threadUpdater(threads);

  if (action.type === 'thread/add-root-comment') {
    const { threadId, commentId } = action as AddRootCommentToThreadAction;

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
    createRootComment: createRootCommentQueryReducer,
  }),
});
