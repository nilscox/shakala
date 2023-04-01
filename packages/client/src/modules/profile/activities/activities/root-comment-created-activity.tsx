import { UserActivityType } from '@shakala/shared';

import IconNewComment from '~/icons/new-comment.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const RootCommentCreatedActivity: ActivityItem<UserActivityType.rootCommentCreated> = (props) => (
  <Activity icon={<IconNewComment />} {...props}>
    <p>
      Vous avez <CommentLink {...props.activity.payload}>commenté</CommentLink> sur le fil de discussion{' '}
      <ThreadLink {...props.activity.payload} />.
    </p>
  </Activity>
);
