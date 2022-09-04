import { createNormalizedSelectors } from '@nilscox/redux-query';
import { getIds } from 'shared';

import { selectUser } from '../authentication';
import { schemas, selectNormalizedEntities } from '../normalization';
import { Selector, State } from '../store';
import { Comment } from '../types';
import { formatDate } from '../utils/format-date';

export const { selectEntity: selectCommentUnsafe, selectEntities: selectComments } =
  createNormalizedSelectors<State, Comment>(selectNormalizedEntities, schemas.comment);

export const selectComment: Selector<[string], Comment> = (state, id) => {
  const comment = selectCommentUnsafe(state, id);

  if (!comment) {
    throw new Error(`selectComment: comment with id "${id}" is not defined`);
  }

  return comment;
};

export const selectFormattedCommentDate: Selector<[string], string> = (state, id) => {
  const { date, edited } = selectComment(state, id);

  const formatted = formatDate(date, "'le' d MMMM");

  if (!edited) {
    return formatted;
  }

  return formatted + ' *';
};

export const selectFormattedCommentDateDetailed: Selector<[string], string> = (state, id) => {
  const { date, edited } = selectComment(state, id);

  const formatted = formatDate(date, "'Le' d MMMM yyyy 'à' HH:mm");

  if (!edited) {
    return formatted;
  }

  return formatted + ' (édité)';
};

export const selectCommentReplies = (state: State, commentId: string) => {
  return selectComment(state, commentId).replies;
};

const selectAllComments = (state: State) => {
  return selectComments(state, Object.keys(state.comments.entities));
};

export const selectParentComment = (state: State, replyId: string) => {
  return selectAllComments(state).find((comment) => getIds(comment.replies).includes(replyId));
};

export const selectIsReply = (state: State, commentId: string) => {
  return selectParentComment(state, commentId) !== undefined;
};

export const selectIsAuthUserAuthor = (state: State, commentId: string) => {
  const user = selectUser(state);
  const { author } = selectComment(state, commentId);

  return user?.id === author.id;
};
