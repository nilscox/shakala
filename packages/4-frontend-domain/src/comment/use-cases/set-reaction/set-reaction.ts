import { requireAuthentication } from '../../../authentication/use-cases/require-authentication/require-authentication';
import { Thunk } from '../../../store';
import { selectCommentThreadId } from '../../../thread';
import { ReactionType } from '../../../types';
import { updateComment } from '../../comments.actions';
import { selectComment } from '../../comments.selectors';

export const setReactionCounts = (
  commentId: string,
  reactionsCounts: Record<'upvotes' | 'downvotes', number>,
) => {
  return updateComment(commentId, reactionsCounts);
};

export const setUserReaction = (commentId: string, userReaction: ReactionType) => {
  return updateComment(commentId, { userReaction });
};

export const unsetUserReaction = (commentId: string) => {
  return updateComment(commentId, { userReaction: undefined });
};

export const setReaction = (commentId: string, reactionType: ReactionType): Thunk<Promise<void>> => {
  return async (dispatch, getState, { threadGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const threadId = selectCommentThreadId(getState(), commentId);
    const comment = selectComment(getState(), commentId);

    const type = comment.userReaction === reactionType ? null : reactionType;

    await threadGateway.setReaction(threadId, commentId, type);

    if (type) {
      dispatch(setUserReaction(commentId, type));
    } else {
      dispatch(unsetUserReaction(commentId));
    }

    const reactionsCounts: Record<ReactionType, number> = {
      [ReactionType.upvote]: comment.upvotes,
      [ReactionType.downvote]: comment.downvotes,
    };

    if (comment.userReaction) {
      reactionsCounts[comment.userReaction]--;
    }

    if (type) {
      reactionsCounts[type]++;
    }

    dispatch(
      setReactionCounts(commentId, {
        upvotes: reactionsCounts[ReactionType.upvote],
        downvotes: reactionsCounts[ReactionType.downvote],
      }),
    );
  };
};
