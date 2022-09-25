import { createNormalizedUpdater, Normalized, normalized } from '@nilscox/redux-query';
import { AnyAction, combineReducers } from 'redux';

import { schemas } from '../normalization';
import { Comment } from '../types';

import { isAddCommentHistoryMessageAction } from './comments.actions';
import {
  createReplyReducer,
  editCommentReducer,
  fetchCommentsQueryReducer,
  isSetIsEditingCommentAction,
} from './use-cases';

type NormalizedComment = Normalized<Comment, 'author' | 'replies'>;

const commentUpdater = createNormalizedUpdater('comment');

const normalizedCommentsReducer = (
  comments: Record<string, NormalizedComment>,
  action: AnyAction,
): Record<string, NormalizedComment> => {
  const updateComment = commentUpdater(comments);

  if (isSetIsEditingCommentAction(action)) {
    const { commentId, isEditing } = action;

    return updateComment(commentId, (comment) => {
      if (!isEditing) {
        return { editionForm: undefined };
      }

      return { editionForm: { text: comment.text } };
    });
  }

  if (isAddCommentHistoryMessageAction(action)) {
    const { commentId, text, date } = action;

    return updateComment(commentId, (comment) => {
      return { history: [...comment.history, { text, date }] };
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
