import { CommentActivityType } from 'shared';

import IconNewComment from '~/icons/new-comment.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const RootCommentCreatedActivity: ActivityItem<CommentActivityType.rootCommentCreated> = ({
  activity,
}) => (
  <Activity activity={activity} icon={<IconNewComment />}>
    <p>
      Vous avez <CommentLink {...activity.payload}>commenté</CommentLink> sur le fil de discussion{' '}
      <ThreadLink {...activity.payload} />.
    </p>
  </Activity>
);
