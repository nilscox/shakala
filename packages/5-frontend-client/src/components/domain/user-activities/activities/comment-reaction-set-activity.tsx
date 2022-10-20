import { CommentActivityType, ReactionTypeDto } from 'shared';

import IconThumbDown from '~/icons/thumb-down.svg';
import IconThumbUp from '~/icons/thumb-up.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const CommentReactionSetActivity: ActivityItem<CommentActivityType.commentReactionSet> = ({
  activity,
}) => (
  <Activity
    activity={activity}
    icon={activity.payload.reaction === ReactionTypeDto.upvote ? <IconThumbUp /> : <IconThumbDown />}
  >
    <p>
      Vous avez {activity.payload.reaction === ReactionTypeDto.upvote ? 'upvoté' : 'downvoté'}{' '}
      <CommentLink {...activity.payload}>un commentaire</CommentLink>
      sur le fil de discussion <ThreadLink {...activity.payload} />.
    </p>
  </Activity>
);
