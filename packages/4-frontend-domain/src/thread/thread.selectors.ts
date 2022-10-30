import { createNormalizedSelectors } from '@nilscox/redux-query';
import { contains } from 'shared';

import { selectParentComment } from '../comment/comments.selectors';
import { schemas, selectNormalizedEntities } from '../normalization';
import { State } from '../store.types';
import { Thread } from '../types';
import { DateFormat, formatDate } from '../utils/format-date';
import { safeSelector } from '../utils/safe-selector';

export const { selectEntity: selectThreadUnsafe, selectEntities: selectThreads } = createNormalizedSelectors<
  State,
  Thread
>(selectNormalizedEntities, schemas.thread);

export const selectThread = safeSelector('thread', selectThreadUnsafe);

export const selectFormattedThreadDate = (state: State, threadId: string) => {
  const { date } = selectThread(state, threadId);

  return formatDate(date, DateFormat.date);
};

export const selectCommentThreadId = (state: State, commentId: string): string => {
  const parent = selectParentComment(state, commentId);

  if (parent) {
    return selectCommentThreadId(state, parent.id);
  }

  const normalizedThreads = Object.values(state.thread);
  const thread = normalizedThreads.find((thread) => contains(thread.comments, commentId));

  if (!thread) {
    throw new Error(`selectCommentThreadId: cannot find thread for commentId "${commentId}"`);
  }

  return thread?.id;
};
