import { ReactionType, UserActivityType } from '@shakala/shared';

import IconThumbDown from '~/icons/thumb-down.svg';
import IconThumbUp from '~/icons/thumb-up.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

// cspell:words upvoté downvoté

export const CommentReactionSetActivity: ActivityItem<UserActivityType.commentReactionSet> = (props) => (
  <Activity
    icon={props.activity.payload.reaction === ReactionType.upvote ? <IconThumbUp /> : <IconThumbDown />}
    {...props}
  >
    <p>
      Vous avez {props.activity.payload.reaction === ReactionType.upvote ? 'upvoté' : 'downvoté'}{' '}
      <CommentLink {...props.activity.payload}>un commentaire</CommentLink> sur le fil de discussion{' '}
      <ThreadLink {...props.activity.payload} />.
    </p>
  </Activity>
);
