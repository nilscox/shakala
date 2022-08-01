import { Normalized, normalized, createNormalizedUpdater } from '@nilscox/redux-query';
import { AnyAction, combineReducers } from '@reduxjs/toolkit';

import { schemas } from '../normalization';
import { Comment } from '../types';

import {
  createReplyReducer,
  editCommentReducer,
  fetchCommentsQueryReducer,
  SetIsEditingCommentAction,
} from './use-cases';

type NormalizedComment = Normalized<Comment, 'author' | 'replies'>;

const commentUpdater = createNormalizedUpdater('comment');

const normalizedCommentsReducer = (
  comments: Record<string, NormalizedComment>,
  action: AnyAction,
): Record<string, NormalizedComment> => {
  const updateComment = commentUpdater(comments);

  if (action.type === 'comment/set-editing') {
    const { commentId, isEditing } = action as SetIsEditingCommentAction;

    return updateComment(commentId, (comment) => {
      if (!isEditing) {
        return { editionForm: undefined };
      }

      return { editionForm: { text: comment.text } };
    });
  }

  return comments;
};

export const commentsReducer = combineReducers({
  entities: normalized<NormalizedComment>(schemas, 'comment', normalizedCommentsReducer),
  queries: combineReducers({
    fetchComments: fetchCommentsQueryReducer,
  }),
  mutations: combineReducers({
    createReply: createReplyReducer,
    editComment: editCommentReducer,
  }),
});
