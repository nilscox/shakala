import { UserActivityType } from '@shakala/shared';

import IconReply from '~/icons/reply.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const ReplyCreatedActivity: ActivityItem<UserActivityType.replyCreated> = (props) => (
  <Activity icon={<IconReply />} {...props}>
    <p>
      Vous avez <CommentLink {...props.activity.payload}>répondu à un commentaire</CommentLink> sur le fil de
      discussion <ThreadLink {...props.activity.payload} />.
    </p>
  </Activity>
);
