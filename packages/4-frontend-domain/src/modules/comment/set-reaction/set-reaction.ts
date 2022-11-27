import { pick, UnexpectedError } from 'shared';

import { AppThunk } from '../../../store';
import { authenticationActions } from '../../authentication';
import { handleAuthorizationError } from '../../authorization';
import { commentActions } from '../comment.actions';
import { commentSelectors } from '../comment.selectors';
import { ReactionType } from '../comment.types';

export const setReaction = (commentId: string, reactionType: ReactionType): AppThunk => {
  return async (dispatch, getState, { commentGateway, snackbarGateway, loggerGateway }) => {
    if (!dispatch(authenticationActions.requireAuthentication())) {
      return;
    }

    const comment = commentSelectors.byId(getState(), commentId);

    if (!comment) {
      throw new UnexpectedError(`expected comment with id "${commentId}" to be defined`);
    }

    const type = comment.userReaction === reactionType ? null : reactionType;

    if (type) {
      dispatch(commentActions.setUserReaction(commentId, type));
    } else {
      dispatch(commentActions.unsetUserReaction(commentId));
    }

    const reactionsCounts: Record<ReactionType, number> = {
      [ReactionType.upvote]: comment.upvotes,
      [ReactionType.downvote]: comment.downvotes,
    };

    const initialReactionsCounts = pick(comment, 'upvotes', 'downvotes');

    if (comment.userReaction) {
      reactionsCounts[comment.userReaction]--;
    }

    if (type) {
      reactionsCounts[type]++;
    }

    dispatch(
      commentActions.setCommentReactionCounts(commentId, {
        upvotes: reactionsCounts[ReactionType.upvote],
        downvotes: reactionsCounts[ReactionType.downvote],
      }),
    );

    try {
      await commentGateway.setReaction(commentId, type);
    } catch (error) {
      if (comment.userReaction) {
        dispatch(commentActions.setUserReaction(commentId, comment.userReaction));
      } else {
        dispatch(commentActions.unsetUserReaction(commentId));
      }

      dispatch(commentActions.setCommentReactionCounts(commentId, initialReactionsCounts));

      if (!dispatch(handleAuthorizationError(error, 'annoter un commentaire'))) {
        snackbarGateway.error("Une erreur s'est produite, votre action n'a pas été comptabilisée.");
        loggerGateway.error(error);
      }
    }
  };
};
