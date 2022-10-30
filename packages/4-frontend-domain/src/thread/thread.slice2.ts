import { Normalized, normalized } from '@nilscox/redux-query';

import { schemas } from '../normalization';
import { Thread } from '../types';

import {
  addRootCommentToThread,
  setCreateRootCommentError,
  setCreateRootCommentTextAction,
  setSubmittingRootComment,
} from './use-cases';

export type NormalizedThread = Normalized<Thread, 'author' | 'comments'>;

export const threadsReducer = normalized<NormalizedThread>(schemas, 'thread', (threads, action) => {
  if (addRootCommentToThread.isAction(action)) {
    return addRootCommentToThread.reducer(threads, action);
  }

  if (setCreateRootCommentTextAction.isAction(action)) {
    return setCreateRootCommentTextAction.reducer(threads, action);
  }

  if (setSubmittingRootComment.isAction(action)) {
    return setSubmittingRootComment.reducer(threads, action);
  }

  if (setCreateRootCommentError.isAction(action)) {
    return setCreateRootCommentError.reducer(threads, action);
  }

  return threads;
});
