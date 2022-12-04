import { EntitySelectors } from '@nilscox/redux-kooltik';
import { createSelector } from 'reselect';

import { commentSchema, normalizationSelectors } from '../../normalization';
import { AppState } from '../../store';
import { threadSelectors } from '../thread';
import { userProfileSelectors } from '../user-account/user-profile.selectors';

import { CommentMeta } from './comment.actions';
import { Comment, NormalizedComment } from './comment.types';

class CommentSelectors extends EntitySelectors<AppState, NormalizedComment, CommentMeta> {
  constructor() {
    super('comment', (state) => state.comment);
  }

  isFetching = this.propertySelector('fetching');
  fetchError = this.propertySelector('fetchError');

  byId = normalizationSelectors.createEntitySelector<Comment>('comment', commentSchema);
  byIds = normalizationSelectors.createEntitiesSelector<Comment>(commentSchema);

  isReply = createSelector(this.byId, (comment) => {
    return !('replies' in comment);
  });

  isEditing = this.entityPropertySelector('editing');
  isReplying = this.entityPropertySelector('replying');
  canReply = createSelector(this.isReply, (isReply) => !isReply);

  isAuthor = createSelector(
    [userProfileSelectors.authenticatedUser, this.byId],
    (user, comment) => comment.author.id === user?.id,
  );

  // todo: make this a safe selector
  threadId = createSelector(
    [threadSelectors.all, (state, commentId: string) => commentId],
    (threads, commentId) => {
      return threads.find((thread) => thread.comments.includes(commentId))?.id;
    },
  );
}

export const commentSelectors = new CommentSelectors();
