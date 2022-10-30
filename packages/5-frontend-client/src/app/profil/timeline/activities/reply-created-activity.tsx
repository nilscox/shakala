import { CommentActivityType } from 'shared';

import IconReply from '~/icons/reply.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const ReplyCreatedActivity: ActivityItem<CommentActivityType.replyCreated> = ({ activity }) => (
  <Activity activity={activity} icon={<IconReply />}>
    <p>
      Vous avez <CommentLink {...activity.payload}>répondu à un commentaire</CommentLink> sur le fil de
      discussion <ThreadLink {...activity.payload} />.
    </p>
  </Activity>
);
